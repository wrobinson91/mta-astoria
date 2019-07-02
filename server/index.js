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
// * then [? tripUpdate.stopTimeUpdate[?stopId==`"R08N"`]]
// * but how do I preserve the parents?
// * this doesn't get enough [? tripUpdate.trip.routeId == `"N"`] && [? tripUpdate.stopTimeUpdate[?stopId == `"R08N"`]]

const express = require('express');
const protobuf = require('protobufjs');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
const fs = require('fs');

const findStartTime = (trainLine) => {
  const { startDate: rawStartDate, startTime: rawStartTime } = trainLine.tripUpdate.trip;
  const rawStartDateStr = rawStartDate.toString();

  const arrStartDate = [rawStartDateStr.slice(0, 4), rawStartDateStr.slice(4, 6),
    rawStartDateStr.slice(6)];
  const arrStartTime = rawStartTime.split(':');

  const startTimeInMS = Date.parse(new Date(arrStartDate[0], Number(arrStartDate[1] - 1), arrStartDate[2],
    arrStartTime[0], arrStartTime[1], arrStartTime[2]));

  return startTimeInMS;
};

// if no stopTimeUpdate prop, the train hasn't started to move yet. can't account for this in set
// look into stopTimeUpdate prop. only look at arrs with idx.stopId that matches current one


// 39th Ave Test
const nextTrainsForMe = (trainData, myStopId = 'R08') => {
  const newTimes = [];
  trainData.entity.forEach((trainRoute) => {
    // calling forEach on all the info in this API
    // console.log('outer for each loop');
    if (trainRoute.tripUpdate !== null && trainRoute.tripUpdate.hasOwnProperty('stopTimeUpdate')) {
      // console.log('made it into first if');
      // if the train has information on its future stops, iterate over that line
      const startTimeInMS = findStartTime(trainRoute);
      trainRoute.tripUpdate.stopTimeUpdate.forEach((stopInfo) => {
        // only looking for northbound trains
        const timeNowMs = Date.parse(new Date());
        // only look for trains whose routes began 20min or more ago -- more likely to be at the end for
        // this particular stop
        if (stopInfo.stopId === `${myStopId}N`) {
          // console.log('found a stop');
          const nextArrivalTimesMS = startTimeInMS + (stopInfo.departure.time * 1000 - startTimeInMS);
          // const msFromNow = stopInfo.departure.time * 1000 - startTimeInMS;
          const minsFromNow = Math.floor((nextArrivalTimesMS - timeNowMs) / 1000 / 60) <= 0 ? 1 : Math.floor((nextArrivalTimesMS - timeNowMs) / 1000 / 60);
          if (minsFromNow <= 30) {
            newTimes.push(minsFromNow);
          }
        }
      });
    }
  });
  return newTimes;
};


const mtaReq = {
  method: 'GET',
  url: 'http://datamine.mta.info/mta_esi.php?key=cd2dda73f82857cc82ab60fe95735909&feed_id=16',
  encoding: null,
};

request(mtaReq, (error, response, body) => {
  if (error) {
    console.log('throwing an error');
    throw new Error(error);
  }
  if (!error && response.statusCode === 200) {
    // console.log('request has been made');
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
    // console.log(feed);
    fs.writeFileSync(`${__dirname}/subwayData.json`, JSON.stringify(feed));

    const myNextTrain = nextTrainsForMe(feed);

    console.log(`Train arrival times are: ${myNextTrain}`);
    console.log(`My next train is in ${Math.min(...myNextTrain)} minutes.`);

    // feed.entity.forEach((entity) => {
    //   // console.log('inside loop');
    //   if (entity.tripUpdate) {
    //     console.log(entity.tripUpdate);
    //   }
    // });
  }
});
