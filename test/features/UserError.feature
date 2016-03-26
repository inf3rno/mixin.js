Feature: UserError
  As a user of the ozone lib
  I want to use custom errors
  So programming object-oriented will be easier

  Scenario: Intantiation
    When I instantiate the UserError class
    Then the instance should be an UserError instance
    And it should be an Error descendant as well
    And it should contain a stack string

  Scenario: Class behavior
    When I try to use Class behavior on the UserError class
    Then I should be able to do it
