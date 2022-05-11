// @ts-check
'use strict';

const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const ForwardingDomain = require("onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain");
const FcPort = require("onf-core-model-ap/applicationPattern/onfModel/models/FcPort");

exports.getFcPortOutputDirectionLogicalTerminationPointListForTheUuid = async function getFcPortOutputDirectionLogicalTerminationPointListForTheUuid(forwardingConstructUuid) {
  let fcPortOutputDirectionLogicalTerminationPointList = [];
  const forwardingConstruct = await findForwardingConstructByUuid(forwardingConstructUuid);
  const fcPortList = forwardingConstruct[onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
  for (const fcPort of fcPortList) {
    const portDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
    if (FcPort.portDirectionEnum.OUTPUT === portDirection) {
      fcPortOutputDirectionLogicalTerminationPointList.push(fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT]);
    }
  }
  return fcPortOutputDirectionLogicalTerminationPointList;
}

async function findForwardingConstructByUuid(forwardingConstructUuid) {
  let forwardingConstructList = await ForwardingDomain.getForwardingConstructListAsync();
  for (let i = 0; i < forwardingConstructList.length; i++) {
    let forwardingConstruct = forwardingConstructList[i];
    if (forwardingConstruct.uuid === forwardingConstructUuid) {
      return forwardingConstruct;
    }
  }
  return undefined;
}