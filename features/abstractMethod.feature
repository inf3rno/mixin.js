Feature: abstractMethod
  As a user of the Ozone lib
  I want to use abstract methods
  So programming object-oriented will be easier

  Scenario: calling an abstract method leads to failure
    When I try to call an abstract method
    Then it should throw an error