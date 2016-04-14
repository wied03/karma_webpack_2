Feature: default

  Scenario: Standard case passes
    Given the 'passing' tests
    And the simple.js Karma config file
    When I run the Karma test
    Then the test passes with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "PASSED"
        }
    }
    """
    And webpack logged informational messages

  Scenario: Existing webpack bundle
    Given the 'passing' tests
    And an existing webpack bundle
    And the simple.js Karma config file
    When I run the Karma test
    Then the existing webpack bundle is left intact

  Scenario: Another loader
    Given the 'opal' tests
    And the opal.js Karma config file
    When I run the Karma test
    Then the test passes with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "PASSED"
        }
    }
    """
  Scenario: Standard case test fails
    Given the 'failing' tests
    And the simple.js Karma config file
    When I run the Karma test
    Then the test fails with JSON results:
    """
    {
        "A suite": {
            "contains spec with an expectation": "FAILED"
        }
    }
    """

  Scenario: Standard case fails with source maps
    Given a complete scenario

  Scenario: Handles webpack compilation errors
    Given a complete scenario

  Scenario: Standard case fails without source maps
    Given a complete scenario
