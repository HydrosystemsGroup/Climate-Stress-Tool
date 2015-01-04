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

- Client-side web application (AngularJS/JointJS/d3)
- Server-side web application (Node)
- Database (PostgreSQL)
- Job Queue (kue/redis)

## Development Server

URL: http://127.0.0.1:3000
Job Queue: http://127.0.0.1:3001

Start redis server:

```
redis-server
```

Start grunt and npm:

```
grunt dev
npm run dev
```

Start worker app:

```
cd worker
node app.js
```
