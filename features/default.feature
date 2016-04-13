Feature: default

  Scenario: Standard case passes
    Given the passing tests tests
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

  Scenario: Standard case fails with source maps
    Given a complete scenario

  Scenario: Standard case fails without source maps
    Given a complete scenario

  Scenario: New spec added
    Given a complete scenario

  Scenario: New spec with dependency added
    Given a complete scenario

  Scenario: Dependency content changes
    Given a complete scenario

  Scenario: Spec removed
    Given a complete scenario
