Gridded Meteorological Data: 1949-2010
======================================

This folder contains scripts for downloading the Maurer et al. 2002 gridded meteorological data, and importing this dataset into a PostgreSQL/PostGIS database.

Reference:

> Maurer, E.P., A.W. Wood, J.C. Adam, D.P. Lettenmaier, and B. Nijssen, 2002, A Long-Term Hydrologically-Based Data Set of Land Surface Fluxes and States for the Conterminous United States, J. Climate 15, 3237-3251.

## Download and Extract Data

```
./download.sh
```

## Setup Database

```
./setup.sh
```

## Import Data to Database

```
./import.sh
```
