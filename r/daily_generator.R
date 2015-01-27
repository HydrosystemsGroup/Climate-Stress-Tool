#!/usr/local/bin/Rscript

fail <- function(txt, status=1) {
  write(txt, file=stderr())
  q('no', status=status)
}

suppressPackageStartupMessages(library(dplyr))
suppressPackageStartupMessages(library(lubridate))
suppressPackageStartupMessages(library(tidyr))
suppressPackageStartupMessages(library(ggplot2))
suppressPackageStartupMessages(library(gridExtra))
suppressPackageStartupMessages(library(weathergen))
suppressPackageStartupMessages(library(forecast))
suppressPackageStartupMessages(library(RPostgreSQL))
suppressPackageStartupMessages(library(jsonlite))

theme_set(theme_bw())

# parse command line arguments
args <- commandArgs(trailingOnly = TRUE)

cat("Starting Weather Generator\n\n")

wd <- args[1]
if (!file.exists(wd)) {
  fail("Error: Working directory does not exist")
}
cat(paste0("Working Directory: ", wd), '\n')
setwd(wd)

# load inputs ----
inputs <- fromJSON('inputs.json')

inputs_names <- c("n_year","start_month","start_water_year","dry_spell_changes","wet_spell_changes","prcp_mean_changes","prcp_cv_changes","temp_changes")
missing_inputs <- setdiff(inputs_names, names(inputs))
if (length(missing_inputs) > 0) {
  fail(paste0("Error: Missing input parameters (", paste(missing_inputs, collapse=','), ')'))
}

n_year <- inputs[['n_year']]
start_month <- inputs[['start_month']]
start_water_year <- inputs[['start_water_year']]
dry_spell_changes <- inputs[['dry_spell_changes']]
wet_spell_changes <- inputs[['wet_spell_changes']]
prcp_mean_changes <- inputs[['prcp_mean_changes']]
prcp_cv_changes <- inputs[['prcp_cv_changes']]
temp_changes <- inputs[['temp_changes']]

cat('Input Parameters:\n')
for (nm in inputs_names) {
  cat(paste(nm, inputs[[nm]], sep=': '), '\n')
}

# n_year <- 10
# start_month <- 10
# start_water_year <- 2000
# dry_spell_changes <- 1
# wet_spell_changes <- 1
# prcp_mean_changes <- 1
# prcp_cv_changes <- 1
# temp_changes <- 0

# load data ----
# drv <- dbDriver("PostgreSQL")
# con <- dbConnect(drv, dbname = "cst")
# clim.da <- dbGetQuery(con, statement = paste(
#   "SELECT to_date(d.year || '-' || trim(to_char(d.month, '00')) || '-' || trim(to_char(d.day, '00')), 'YYYY-MM-DD') as date,",
#        "prcp, tmax, tmin, wind",
#   "FROM maurer_day d, (",
#   paste0("SELECT ST_Distance(m.geom, ST_SetSRID(ST_MakePoint(", longitude, ", ", latitude, "), 4326)) as distance,"),
#          "m.gid, m.latitude, m.longitude",
#     "FROM maurer_locations m",
#     "ORDER BY distance",
#     "LIMIT 1",
#   ") AS l",
#   "WHERE d.location_id=l.gid",
#   "ORDER BY date"));
clim.da <- fromJSON('data.json')

clim.da$date <- ymd_hms(clim.da$date)

names(clim.da) <- toupper(names(clim.da))
clim.da$TEMP <- (clim.da$TMIN+clim.da$TMAX)/2

clim.mon <- group_by(clim.da, DATE=floor_date(DATE, 'month')) %>%
  summarise(PRCP=sum(PRCP),
            TMAX=mean(TMAX),
            TMIN=mean(TMIN),
            TEMP=mean(TEMP))
clim.wyr <- group_by(clim.da, WYEAR=wyear(DATE, start_month=start_month)) %>%
  summarise(N=n(),
            PRCP=sum(PRCP),
            TMAX=mean(TMAX),
            TMIN=mean(TMIN),
            TEMP=mean(TEMP))

complete_years <- clim.wyr$WYEAR[which(clim.wyr$N>=365)]

clim.da <- filter(clim.da, wyear(DATE, start_month=start_month) %in% complete_years)
clim.mon <- filter(clim.mon, wyear(DATE, start_month=start_month) %in% complete_years)
clim.wyr <- filter(clim.wyr, WYEAR %in% complete_years)

# annual sim ----
sim <- tryCatch({
  wgen_daily(obs_day = zoo(x = clim.da[, c('PRCP', 'TEMP', 'TMIN', 'TMAX', 'WIND')],
                           order.by = clim.da[['DATE']]),
             n_year=n_year, n_knn_annual=100,
             dry_wet_threshold=0.3, wet_extreme_quantile_threshold=0.8,
             start_month=start_month, start_water_year=start_water_year, include_leap_days=FALSE,
             adjust_annual_precip=TRUE, annual_precip_adjust_limits=c(0.9, 1.1),
             dry_spell_changes=dry_spell_changes,
             wet_spell_changes=wet_spell_changes,
             prcp_mean_changes=prcp_mean_changes,
             prcp_cv_changes=prcp_cv_changes,
             temp_changes=temp_changes)
}, error = function(err) {
  fail(as.character(err))
})

select(sim$out, DATE, PRCP, TEMP, TMIN, TMAX) %>%
  write.csv(file='sim.csv', row.names=FALSE)

# out.day <- select(sim[['out']], DATE, PRCP, TEMP, TMIN, TMAX)
# out.mon <- mutate(out.day, DATE=floor_date(DATE, unit='month')) %>%
#   group_by(DATE) %>%
#   summarize(PRCP=sum(PRCP),
#             TEMP=mean(TEMP),
#             TMIN=mean(TMIN),
#             TMAX=mean(TMAX))
# out.wyr <- mutate(out.day, WYEAR=wyear(DATE)) %>%
#   group_by(WYEAR) %>%
#   summarize(PRCP=sum(PRCP),
#             TEMP=mean(TEMP),
#             TMIN=mean(TMIN),
#             TMAX=mean(TMAX))

# p.day.prcp <- out.day %>%
#   ggplot(aes(DATE, PRCP)) +
#   geom_line() +
#   labs(x='Date', y='Precipitation (mm/day)') +
#   theme_bw()
# p.day.temp <- out.day %>%
#   ggplot(aes(DATE, TEMP)) +
#   geom_ribbon(aes(ymin=TMIN, ymax=TMAX)) +
#   geom_line() +
#   labs(x='Date', y='Temperature (deg C)') +
#   theme_bw()
#
# png(filename='daily.png', width=600, height=400)
# grid.arrange(p.day.prcp, p.day.temp, ncol=1)
# dev.off()

# box.wyr <- rbind(select(clim.wyr, WYEAR, PRCP, TMAX, TMIN, TEMP) %>% mutate(SOURCE='Historical'),
#                  mutate(out.wyr, SOURCE='Simulated'))
# p.wyr.prcp.box <- box.wyr %>%
#   ggplot(aes(SOURCE, PRCP)) +
#   geom_boxplot() +
#   theme_bw()

save(sim, file='sim.rda')

cat(paste0("Saved output to: ", file.path(getwd(), 'sim.csv')))