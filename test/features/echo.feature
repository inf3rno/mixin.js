Feature: echo
  As a user of the ozone lib
  I want to use the echo function
  So I would not need to declare it when I need to echo an argument

  Scenario: Echo with single argument
    When I call echo with a single argument
    Then the argument should be returned

  Scenario: Echo with multiple arguments
    When I call echo with multiple arguments
    Then the first argument should be returned

