Feature: default

  Scenario: Standard case passes
    Given the 'passing' tests
    And the simple.js Karma config file
    When I run the Karma test
    Then the test passes with JSON results:
    """
    {
        "something nested": {
            "should eq 42": "PASSED"
        }
    }
    """
    And existing webpack bundle is left intact

  Scenario: Standard case fails with source maps
    Given a complete scenario

  Scenario: Standard case fails without source maps
    Given a complete scenario
