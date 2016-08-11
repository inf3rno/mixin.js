Feature: UserError
  As a user of the Ozone lib
  I want to use error subclasses
  So handling errors by type will be easier

  Scenario: instantiating user error with custom properties
    When I create a new user error instance with custom properties
    Then this instance should contain the custom properties

  Scenario: using the stack of user errors
    When I create a new user error instance
    Then the stack property should contain the type, the message and the stack frames of this instance