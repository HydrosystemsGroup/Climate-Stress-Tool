UMass Climate Stress Tool
=========================

Climate Stress Tool developed by the [UMass HydroSystems Research Group](http://cee.umass.edu/cee/hydrosystems)

[Jeffrey D. Walker, PhD](http://walkerjeff.com)

This application provides a web-based interface to the [weathergen R package](http://walkerjeffd.github.io/weathergen), which provides access to a semi-parametric stochastic weather generator developed by Scott Steinschneider. More details on the weather generator are available in:

> Steinschneider, S., & Brown, C. (2013). A semiparametric multivariate, multisite weather generator with low-frequency variability for use in climate risk assessments. Water Resources Research, 49(11), 7205–7220. doi:10.1002/wrcr.20528

## Overview

The Climate Stress Tool web application is comprside of:

- a REST API for retrieving climate datasets and submitting jobs for running the weather generator
- a client-side application for fetching historical data (or uploading data in text files), running the weather generator, and downloading the results

## Dataset

The application provides access to the [Gridded Meteorological Data: 1949-2010](http://www.engr.scu.edu/~emaurer/gridded_obs/index_gridded_obs.html) by Maurer et al, 2002. The dataset is stored in a PostgreSQL database.

> Maurer, E.P., A.W. Wood, J.C. Adam, D.P. Lettenmaier, and B. Nijssen, 2002, A Long-Term Hydrologically-Based Data Set of Land Surface Fluxes and States for the Conterminous United States, J. Climate 15, 3237-3251.

## Application Components

- Client-side web application (AngularJS/d3)
- Server-side web application (Node/Express)
- Database (PostgreSQL)
- Job Queue (kue/redis)

## Development Server

To run the development server:

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

The application is accessible at `http://localhost:3000/`

The job queue is accessible at `http://localhost:3000/jobs`
