Feature: dummy
  As a user of the ozone lib
  I want to use the dummy function
  So I would not need to declare it when a function which does not do anything

  Scenario: Dummy with any argument
    When I call dummy with any argument
    Then undefined should be returned
