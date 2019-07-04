// MTA API key: cd2dda73f82857cc82ab60fe95735909
// NQRW: http://datamine.mta.info/mta_esi.php?key=cd2dda73f82857cc82ab60fe95735909&feed_id=16
// BDFM: http://datamine.mta.info/mta_esi.php?key=cd2dda73f82857cc82ab60fe95735909&feed_id=21
// TODO: Look up JMES. This query will dig down into entities with the data I need: entity[*].tripUpdate_____
// TODO: to sift through remaining object, I need to do

// TODO key first query: @.entity[*].tripUpdate
// TODO next query: [? trip.routeId == `"N"`|| trip.routeId == `"W"`]
// TODO: still having trouble isolating stops I need
// might be: [? stopTimeUpdate.stopId=="R08N"]
// this next one gets it: [*].stopTimeUpdate[? stopId==`"R08N"`]
//


// * @.entity
// * then [? tripUpdate.trip.routeId == `"N"` || tripUpdate.trip.routeId == `"W"`]
// * then [? tripUpdate.stopTimeUpdate[?stopId==`"R08S"`]]
// * but how do I preserve the parents?
// * this doesn't get enough [? tripUpdate.trip.routeId == `"N"`] && [? tripUpdate.stopTimeUpdate[?stopId == `"R08S"`]]

const request = require('request');

// const fetch = require('node-fetch');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

// const myProxy = 'https://cors-anywhere.herokuapp.com/';
const mtaURL = 'http://datamine.mta.info/mta_esi.php?key=cd2dda73f82857cc82ab60fe95735909&feed_id=16';
const mtaReq = {
  method: 'GET',
  url: mtaURL,
  encoding: null,
};

const dataController = {
  findStartTime(trainLine) {
    const { startDate: rawStartDate, startTime: rawStartTime } = trainLine.tripUpdate.trip;
    const rawStartDateStr = rawStartDate.toString();

    const arrStartDate = [rawStartDateStr.slice(0, 4), rawStartDateStr.slice(4, 6),
      rawStartDateStr.slice(6)];
    const arrStartTime = rawStartTime.split(':');

    const startTimeInMS = Date.parse(new Date(arrStartDate[0], Number(arrStartDate[1] - 1), arrStartDate[2],
      arrStartTime[0], arrStartTime[1], arrStartTime[2]));

    return startTimeInMS;
  },

  // if no stopTimeUpdate prop, the train hasn't started to move yet. can't account for this in set
  // look into stopTimeUpdate prop. only look at arrs with idx.stopId that matches current one


  // 39th Ave Test
  // Q01 is for N, express
  // R33 is for WR, local
  nextTrainsForMe(trainData, myStopId = ['R08S'], workStop = ['R23S', 'Q01S'], timeToWalk = 5) {
    const newTimes = [];
    trainData.entity.forEach((trainRoute) => {
      // calling forEach on all the info in this API
      // console.log('outer for each loop');
      if (trainRoute.tripUpdate !== null && trainRoute.tripUpdate.hasOwnProperty('stopTimeUpdate')) {
        // console.log('made it into first if');
        // if the train has information on its future stops, iterate over that line
        const startTimeInMS = dataController.findStartTime(trainRoute);
        const stopObj = {};

        // looks filters out Q and R trains
        if (trainRoute.tripUpdate.trip.routeId === 'N' || trainRoute.tripUpdate.trip.routeId === 'W') {
          stopObj.trainLine = trainRoute.tripUpdate.trip.routeId;
          trainRoute.tripUpdate.stopTimeUpdate.forEach((stopInfo) => {
            // only looking for northbound trains
            const timeNowMs = Date.parse(new Date());
            // only look for trains whose routes began 20min or more ago -- more likely to be at the end for
            // this particular stop
            // cut out
            if (myStopId.includes(stopInfo.stopId)) {
              // console.log('found a stop');
              const nextArrivalTimesMS = startTimeInMS + (stopInfo.departure.time * 1000 - startTimeInMS);
              // const msFromNow = stopInfo.departure.time * 1000 - startTimeInMS;
              const minsFromNow = Math.floor((nextArrivalTimesMS - timeNowMs) / 1000 / 60) <= 0 ? 1 : Math.floor((nextArrivalTimesMS - timeNowMs) / 1000 / 60);
              // filter for walk to station factor
              if (minsFromNow <= 30 + timeToWalk && minsFromNow >= timeToWalk) {
                stopObj.departTime = minsFromNow;
                if (Object.keys(stopObj).length === 3) {
                  // hard coded
                  // stopObj.trainLine = 'N';

                  newTimes.push(stopObj);
                  // console.log(newTimes);
                  // break;
                }
              }
            }

            if (workStop.includes(stopInfo.stopId)) {
              const nextDepartureTimeMS = startTimeInMS + (stopInfo.arrival.time * 1000 - startTimeInMS);
              const minsFromNow = Math.floor((nextDepartureTimeMS - timeNowMs) / 1000 / 60) <= 0 ? 1 : Math.floor((nextDepartureTimeMS - timeNowMs) / 1000 / 60);
              stopObj.arrivalTime = minsFromNow;
              if (Object.keys(stopObj).length === 3) {
                // hard coded
                // stopObj.trainLine = 'N';
                newTimes.push(stopObj);
                // console.log(newTimes);
                // break;
              }
            }
          });
        }
      }
    });
    return newTimes;
  },
  // tried as async, did not work!!!!!!
  getMyTrainData(req, res, next) {
    // fetch(mtaURL, mtaReq)
    //   .then((data) => {
    //     const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(data);
    //     console.log(feed);
    //     return feed.json();
    //   })
    //   .then((trainData) => {
    //     const myNextTrain = nextTrainsForMe(trainData);
    //     console.log(`Train arrival times are: ${myNextTrain}`);
    //     console.log(`My next train is in ${Math.min(...myNextTrain)} minutes.`);
    //     return myNextTrain;
    //   })
    //   .catch((error) => {
    //     console.log('error in fetching');
    //     throw new Error(error);
    //   });

    // console.log(res.locals.userInfo);
    // let homeStop, workStop, timeToStation;
    // if(req.query.username) {
    //   homeStop = req
    // }

    const {
      homeStop,
      workStop,
      timeToStation,
    } = res.locals.userInfo;

    console.log('time to get me some data with: ', homeStop, workStop, timeToStation);

    request(mtaReq, (error, response, body) => {
      console.log('request has been made');
      if (error) {
        console.log('throwing an error');
        throw new Error(error);
      }
      if (!error && response.statusCode === 200) {
        // console.log('request has been made');
        console.log('request completed');
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        // console.log(feed);
        // console.log(feed);

        // const myNextTrain = dataController.nextTrainsForMe(feed, homeStop, workStop, timeToStation).sort((a, b) => a.arrivalTime - b.arrivalTime);
        const myNextTrain = dataController.nextTrainsForMe(feed, homeStop, workStop, timeToStation).sort((a, b) => a.arrivalTime - b.arrivalTime);
        console.log(myNextTrain);

        // // console.log(`Train arrival times are: ${Object.values(myNextTrain)}`);
        // console.log(`The best next train you can catch is in ${myNextTrain[0].departTime} minutes. It'll reach your work stop in ${myNextTrain[0].arrivalTime} minutes.`);
        // console.log('returning out this array: ', myNextTrain);
        // return myNextTrain;
        res.locals.myNextTrain = myNextTrain;
        return next();
      }
      // return next();
    });
  },
};


// getMyTrainData();

module.exports = dataController;
