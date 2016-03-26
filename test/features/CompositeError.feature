Feature: CompositeError
  As a user of the ozone lib
  I want to use composite errors
  So programming object-oriented will be easier

  Scenario: Intantiation
    When I instantiate the CompositeError class with Error attributes
    Then the instance should be a CompositeError instance
    And it should be an UserError descendant
    And it should have a joined stack with the stacks of the Error attributes