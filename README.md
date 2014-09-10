UMass Climate Stress Tool
=========================

Climate Stress Tool developed by the [UMass HydroSystems Research Group](http://cee.umass.edu/cee/hydrosystems)

Jeffrey D. Walker, PhD
2014-07-23

## Specifications

- API to weather generator for obtaining a set of climate sensitivity files
- Interactive drag-and-drop interface for configuring a water resources systems model
- Simulation/optimization model for performing a climate stress test

## Components

- OpenCPU for running R scripts
- Joint.js for model configuration
- Backbone.js for client-side web application
- Node.js for server-side web application
- Database (Mongo or MySQL?)


# Set Up for Heroku

```
heroku config:set NODE_ENV=production
```
