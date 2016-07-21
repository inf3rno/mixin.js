Feature: Class
  As a user of the Ozone lib
  I want to use classes
  So programming object-oriented will be easier

  Scenario: using the constructor given in the config
    Given a config with a constructor
    When I create a class based on this config
    Then the constructor of the class should be the constructor given in the config

  Scenario: creating constructor by the factory given in the config
    Given a config with factory
    When I create a class based on this config
    Then the constructor of the class should be created by the factory given in the config

  Scenario: creating constructor by the factory inherited from the ancestor
    Given an ancestor class having a factory
    When I create a class inheriting from this ancestor
    Then the constructor of the class should be created by the factory inherited from the ancestor

  Scenario: creating constructor by the default factory
    When I create a class without a factory
    Then the constructor of the class should be created by the default factory

  Scenario: adding properties of the config
    Given a config having properties
    When I create a class based on this config
    Then the class should add the properties from the config

  Scenario: inheriting properties of the ancestor
    Given an ancestor class having properties
    When I create a class inheriting from this ancestor
    Then the class should inherit properties of the ancestor

  Scenario: adding properties of another class
    When I create a class and merge it with the properties of another class
    Then the class should add the properties of the other class

  Scenario: inheriting methods of the Class class
    When I create a class inheriting from the Class class
    Then the class should inherit the methods declared in the Class class

  Scenario: adding methods of the Class class
    When I create a class and merge it with the Class class properties
    Then the class should add the properties of the Class class


