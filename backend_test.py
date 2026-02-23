import requests
import sys
import json
from datetime import datetime

class RentEaseAPITester:
    def __init__(self, base_url="https://fd1ff0cf-16e7-47d5-9ff6-3cb0ff75c68b.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            try:
                response_json = response.json()
            except:
                response_json = {"text": response.text}
            
            if success:
                self.log_test(name, True)
                print(f"   Status: {response.status_code}")
                return True, response_json
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}")
                print(f"   Status: {response.status_code}")
                print(f"   Response: {response_json}")
                return False, response_json

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            print(f"   Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        success, response = self.run_test(
            "API Health Check",
            "GET",
            "api",
            200
        )
        
        if success:
            expected_message = "Rental Marketplace API is running"
            actual_message = response.get('message', '')
            if expected_message == actual_message:
                print(f"   ✅ Correct health check message: '{actual_message}'")
                return True
            else:
                print(f"   ❌ Wrong message. Expected: '{expected_message}', Got: '{actual_message}'")
                self.log_test("Health Check Message Content", False, f"Wrong message content")
                return False
        return False

    def test_user_registration(self, role):
        """Test user registration for specific role"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "name": f"Test {role} {timestamp}",
            "email": f"test{role.lower()}{timestamp}@example.com",
            "password": "TestPass123!",
            "role": role
        }

        success, response = self.run_test(
            f"User Registration ({role})",
            "POST",
            "api/auth/register",
            201,
            data=test_user_data
        )

        if success:
            # Store token and user info for subsequent tests
            if response.get('token'):
                self.token = response['token']
                print(f"   ✅ Token received and stored")
            
            user_info = response.get('user', {})
            if user_info.get('role') == role:
                print(f"   ✅ Role correctly set to {role}")
                return True, user_info
            else:
                print(f"   ❌ Role mismatch. Expected {role}, got {user_info.get('role')}")
                return False, user_info
        
        return False, {}

    def test_user_login(self, email, password):
        """Test user login"""
        login_data = {
            "email": email,
            "password": password
        }

        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data=login_data
        )

        if success and response.get('token'):
            self.token = response['token']
            print(f"   ✅ Login successful, token stored")
            return True, response.get('user', {})
        
        return False, {}

    def test_get_listings(self):
        """Test fetching listings"""
        success, response = self.run_test(
            "Get All Listings",
            "GET",
            "api/listings",
            200
        )

        if success:
            listings = response.get('listings', [])
            count = response.get('count', 0)
            print(f"   ✅ Retrieved {count} listings")
            return True, listings
        
        return False, []

    def test_create_listing(self):
        """Test creating a new listing (requires Owner role and auth)"""
        if not self.token:
            self.log_test("Create Listing (No Auth)", False, "No authentication token")
            return False, {}

        listing_data = {
            "title": "Test Property",
            "type": "apartment",
            "price": 1500,
            "squareFeet": 800,
            "addressText": "123 Test Street, Test City",
            "description": "A beautiful test property for automated testing"
        }

        success, response = self.run_test(
            "Create Listing (Owner)",
            "POST",
            "api/listings",
            201,
            data=listing_data
        )

        return success, response

    def test_invalid_endpoints(self):
        """Test some invalid endpoints to check error handling"""
        # Test invalid endpoint
        success, response = self.run_test(
            "Invalid Endpoint",
            "GET",
            "api/nonexistent",
            404
        )

        # Test invalid listing ID
        success2, response2 = self.run_test(
            "Invalid Listing ID",
            "GET",
            "api/listings/invalid-id",
            500  # Expecting server error for invalid ObjectId
        )

        return success or success2

    def run_all_tests(self):
        """Run comprehensive API tests"""
        print("🚀 Starting RentEase API Tests")
        print("=" * 50)

        # 1. Health Check
        print("\n📊 BASIC API TESTS")
        self.test_health_check()

        # 2. Test Registration - Customer
        print("\n👤 USER REGISTRATION TESTS")
        customer_success, customer_user = self.test_user_registration("CUSTOMER")
        customer_email = None
        if customer_success:
            customer_email = customer_user.get('email')

        # Reset token for owner registration
        self.token = None
        
        # 3. Test Registration - Owner  
        owner_success, owner_user = self.test_user_registration("OWNER")
        owner_email = None
        if owner_success:
            owner_email = owner_user.get('email')

        # 4. Test Login with Customer
        print("\n🔐 LOGIN TESTS")
        if customer_email:
            self.token = None  # Reset token
            customer_login_success, _ = self.test_user_login(customer_email, "TestPass123!")

        # 5. Test Listings (as Customer)
        print("\n🏠 LISTINGS TESTS")
        self.test_get_listings()

        # 6. Test Login with Owner
        if owner_email:
            self.token = None  # Reset token
            owner_login_success, _ = self.test_user_login(owner_email, "TestPass123!")
            
            # 7. Test Create Listing (as Owner)
            if owner_login_success:
                self.test_create_listing()

        # 8. Error Handling Tests
        print("\n⚠️ ERROR HANDLING TESTS")
        self.test_invalid_endpoints()

        # Print Results
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 ALL TESTS PASSED!")
            return 0
        else:
            print("❌ SOME TESTS FAILED!")
            print("\nFailed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['name']}: {result['details']}")
            return 1

def main():
    tester = RentEaseAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())