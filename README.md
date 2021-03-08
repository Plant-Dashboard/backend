# Plant Dashboard Back End
REST API to serve sensor data to the front end. 

Planned on having people log in to Goolge to be authenticated for the camera stream. In the process I had the idea of just setting a password for it. So that is the route im going at the moment. 

## Reading schema: 

| readingTime   | temperature   | humidity  |
| ------------- |:-------------:| ---------:|
| DateTime      | double       |double    |

## Endpoint
### https://plant-dashboard-v1.herokuapp.com/api/v1/readings 
  - HTTP params are available to sort and filter the data


