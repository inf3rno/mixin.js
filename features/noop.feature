Feature: noop function
  As a user of the Ozone lib
  I want to use the noop function
  So I won't need to declare empty functions when I need to pass an empty callback

  Scenario: calling noop does not do anything
    When I call noop with any argument
    Then undefined should be returned
