Feature: CompositeError
  As a user of the Ozone lib
  I want to use composite errors
  So raising nested errors will be easier

  Scenario: using the stack of composite errors
    When I create a new composite error instance
    And this instance contains other error instances
    Then the stack of this instance should include the stack of the other error instances

