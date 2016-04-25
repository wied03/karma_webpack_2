Feature: Customize configuration
  Scenario: Vendor entry point
    Given the 'passing' tests
    And the vendor_entry.js Karma config file
    When I run the Karma test
    Then the test passes with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "PASSED"
        }
    }
    """

  Scenario: Merge webpack.config.js
    Given a complete scenario

  Scenario: Webpack debug logging
    Given a complete scenario
