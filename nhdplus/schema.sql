-- Create a derived table that has the denormalized results for just our serving
-- PostGIS 9.1 is smart enough to set up the spatial column metadata for us
create table nhdvaa as
  select
    nhdflowline.*, 
    plusflowlinevaa.hydroseq, 
    plusflowlinevaa.fromnode, 
    plusflowlinevaa.tonode
  from nhdflowline
  inner join plusflowlinevaa
  on nhdflowline.comid = plusflowlinevaa.comid
  where nhdflowline.ftype != 'Coastline';
