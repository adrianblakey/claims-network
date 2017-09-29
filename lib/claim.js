/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
/*
function BigDecimalAdd([theNumbers]) {
    var theTotal = theFactory.newConcept(NS, 'BigDecimal');
    theTotal.integerPart = 0;
    theTotal.fractionPart = 0; 
    for (var i = 0; i < theNumbers.size; i++) {
        theTotal.fractionPart += theNumbers[i].fractionPart;
    }
    theTotal.integerPart = theTotal.fractionPart / 100;  // Integer divide to get the overflow
    theTotal.fractionPart -= theTotal.integerPart;
    for (var i = 0; i < theNumbers.size; i++) {
        theTotal.integerPart += theNumbers[i].integerPart;
    }
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  */

/**
 * Set up the run
 * @param {org.acme.claim.CreateSubmittedClaim} createSubmittedClaim - the setUp transaction instance
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function createSubmittedClaim(createSubmittedClaim) {
    var NS = 'org.acme.claim';
    var theFactory = getFactory();
// Create a submitted dental claim
    console.log('Create a submitted dental claim');
    var submittedDentalClaim = theFactory.newResource(NS, 'SubmittedDentalClaim', '1');
    submittedDentalClaim.dentalClaimType = 'ENCOUNTER';
// Predetermination is omitted
    submittedDentalClaim.planName = 'Some primary dental plan';
// Create a Plan Address
    var aPlanAddress = theFactory.newConcept(NS, 'Address');
    aPlanAddress.addr1 = '123 Street';
    aPlanAddress.city = 'Some City';
    aPlanAddress.state = 'CA';
    aPlanAddress.postcode = '94501';
    submittedDentalClaim.planName = 'Some primary dental plan';
    submittedDentalClaim.planAddress = aPlanAddress;
    // Other coverage omitted 
    // Policyholder/subscriber information
    // Name
    var aMemberName = theFactory.newConcept(NS, 'HumanName');
    aMemberName.firstName = 'John';
    aMemberName.lastName = 'Smith';
    submittedDentalClaim.memberName = aMemberName;
    var aMemberClaimAddress = theFactory.newConcept(NS, 'Address');
    aMemberClaimAddress.addr1 = '123 Street';
    aMemberClaimAddress.city = 'Some City';
    aMemberClaimAddress.state = 'CA';
    aMemberClaimAddress.postcode = '94501';
    submittedDentalClaim.memberAddress = aMemberClaimAddress;
    submittedDentalClaim.memberDateOfBirth = new Date('1990/11/1');
    submittedDentalClaim.memberGender = 'MALE';
    submittedDentalClaim.memberId = '100';
    submittedDentalClaim.planOrGroupNumber = '123';
    submittedDentalClaim.employerName = 'Some Company';                       
// Patient information
    submittedDentalClaim.patientsRelationshipToPolicyHolder = 'SELF';
    if (submittedDentalClaim.patientsRelationshipToPolicyHolder === 'SELF') {
        submittedDentalClaim.patientName = submittedDentalClaim.memberName;                  
        submittedDentalClaim.patientAddress = submittedDentalClaim.memberAddress;
        submittedDentalClaim.patientDateOfBirth = submittedDentalClaim.memberDateOfBirth;
        submittedDentalClaim.patientGender = submittedDentalClaim.memberGender;
    }
    submittedDentalClaim.dentistPatientId = '123';
    // Service lines
    submittedDentalClaim.submittedDentalServiceLines = [];
    theSubmittedDentalServiceLines = [];    // Objects to save
    var totalIntegerPart = 0;
    var totalFractionPart = 0;
    var toothNumber = 10;
    for (var i=0; i<3; i++) {
        var aSubmittedDentalServiceLine = theFactory.newResource(NS, 'SubmittedDentalServiceLine', 'SL' + i);
        theSubmittedDentalServiceLines.push(aSubmittedDentalServiceLine);
        var aSubmittedDentalServiceLineReln = theFactory.newRelationship(NS, 'SubmittedDentalServiceLine', 'SL' + i);
        aSubmittedDentalServiceLine.dentalServiceLineId = i + '';
        aSubmittedDentalServiceLine.lineNumber = i;
        aSubmittedDentalServiceLine.procedureDate = new Date(Date.now() - 2 * 86400000); 
        aSubmittedDentalServiceLine.areaOfOralCavity = 'Back';
        aSubmittedDentalServiceLine.toothSystem = 'A';
        toothNumber += i;
        aSubmittedDentalServiceLine.toothNumberOrLetter = toothNumber + '';
        aSubmittedDentalServiceLine.toothSurface = 'POST';
        aSubmittedDentalServiceLine.procedureCode = '120XXXX';
        aSubmittedDentalServiceLine.diagPointer = toothNumber + '';
        aSubmittedDentalServiceLine.quantity = 1;
        aSubmittedDentalServiceLine.description = 'Description';
        var aServiceLineFee = theFactory.newConcept(NS, 'BigDecimal');
        aServiceLineFee.integerPart = 51 * 2 * i;
        aServiceLineFee.fractionPart = 98  + i;               // Just create some value that will overflow
        totalIntegerPart += aServiceLineFee.integerPart;
        totalFractionPart += aServiceLineFee.fractionPart;
        aSubmittedDentalServiceLine.fee = aServiceLineFee;
        console.log('Service line: ' + JSON.stringify(getSerializer().toJSON(aSubmittedDentalServiceLine)));
        submittedDentalClaim.submittedDentalServiceLines.push(aSubmittedDentalServiceLineReln);
    }
    var theTotalFees = theFactory.newConcept(NS, 'BigDecimal');
    // Add the total 
    theTotalFees.integerPart = totalFractionPart / 100; // Capture the overflow
    theTotalFees.fractionPart = totalFractionPart - theTotalFees.integerPart; // Subtract the overflow
    theTotalFees.integerPart += totalIntegerPart;
    //
    submittedDentalClaim.totalFees = theTotalFees; 
    submittedDentalClaim.amount = 21.21;  // TODO remove this !
    submittedDentalClaim.patientGuardianSignature = true;
    submittedDentalClaim.subscriberSignature = true; 
    submittedDentalClaim.placeOfTreatmentCode = 11; // office
    // Billing provider
    var aBillingProviderName = theFactory.newConcept(NS, 'HumanName');
    aBillingProviderName.firstName = 'Joan';
    aBillingProviderName.lastName = 'Smythe';
    console.log('Billing provider name: ' + aBillingProviderName);
    submittedDentalClaim.billingProviderName = aBillingProviderName;
    // Billing provider address
    var aBillingProviderAddress = theFactory.newConcept(NS, 'Address');
    aBillingProviderAddress.addr1 = '123 Street';
    aBillingProviderAddress.city = 'Some City';
    aBillingProviderAddress.state = 'CA';
    aBillingProviderAddress.postcode = '94501';
    submittedDentalClaim.billingProviderAddress = aBillingProviderAddress;
    submittedDentalClaim.billingProviderNpi = '222';
    submittedDentalClaim.billingProviderLicense = 'CA 42';
    submittedDentalClaim.billingProviderTin = '23-789';
    submittedDentalClaim.billingProviderPhoneNumber = '415-555-1212';
    // Treating provider
    var aTreatingProviderName = theFactory.newConcept(NS, 'HumanName');
    aTreatingProviderName.firstName = 'John';
    aTreatingProviderName.lastName = 'Smith';
    console.log('Treating provider name: ' + aTreatingProviderName);
    submittedDentalClaim.treatingProviderName = aTreatingProviderName;
    // Treating provider details
    submittedDentalClaim.treatingProviderNpi = '1234567890';
    submittedDentalClaim.treatingProviderLicense = 'CA 1234';
    submittedDentalClaim.treatingProviderPhoneNumber = '415-555-1212';
    // Treating provider address
    var aTreatingProviderAddress = theFactory.newConcept(NS, 'Address');
    aTreatingProviderAddress.addr1 = '123 Street';
    aTreatingProviderAddress.city = 'Some City';
    aTreatingProviderAddress.state = 'CA';
    aTreatingProviderAddress.postcode = '94501';
    submittedDentalClaim.treatingProviderAddress = aTreatingProviderAddress;
    // Dump
    console.log('Submitted claim: ' + JSON.stringify(getSerializer().toJSON(submittedDentalClaim)));
    return getAssetRegistry(NS + '.SubmittedDentalServiceLine')
        .then(function(submittedDentalServiceLineRegistry) {
            submittedDentalServiceLineRegistry.addAll(theSubmittedDentalServiceLines);
        })
        .then (function() {
            return getAssetRegistry(NS + '.SubmittedDentalClaim');
        })
        .then(function(submittedClaimRegistry) {
            console.log('Adding submitted dental claim: ' + submittedDentalClaim);
            submittedClaimRegistry.addAll([submittedDentalClaim]);
        })
        .catch(function(error) {
            console.log('Error ' + error);
        });
}

/**
 * Adjudicate a claim
 * @param {org.acme.claim.AdjudicateDentalClaim} adjudicateDentalClaim - the adjudicateDentalClaim transaction instance
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function adjudicateDentalClaim(adjudicateDentalClaim) {
    // TODO This is a 10 step process ...
    // Create an adjudicated claim that references the submitted claim - lame PoC
    var NS = 'org.acme.claim';
    var theFactory = getFactory();  
    var theAdjudicatedDentalClaim = theFactory.newResource(NS, 'AdjudicatedDentalClaim', '1');
    theAdjudicatedDentalClaim.claimStatus = 'HELD';
    theAdjudicatedDentalClaim.dentalClaimType = 'ENCOUNTER';
    theAdjudicatedDentalClaim.amount = adjudicateDentalClaim.submittedDentalClaim.amount; // TODO this needs to be a big decimal!
    theAdjudicatedDentalClaim.submittedDentalClaim = theFactory.newRelationship(NS, 'SubmittedDentalClaim', adjudicateDentalClaim.submittedDentalClaim.$identifier);
    console.log('Add the new adjudicated dental claim: ' + theAdjudicatedDentalClaim); 
    return getAssetRegistry(NS + '.AdjudicatedDentalClaim')
        .then(function (adjudicatedDentalClaimAssetRegistry) {
            console.log('Add the new adjudicated dental claim: ' + theAdjudicatedDentalClaim); 
            return adjudicatedDentalClaimAssetRegistry.add(theAdjudicatedDentalClaim);
        })
        .then(function() {
            console.log('Send the dental claim event for ac id: ' + theAdjudicatedDentalClaim.claimId);
            var event = theFactory.newEvent(NS, 'StartAdjudicationEvent');
            event.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaim.claimId);
            event.submittedDentalClaim = theFactory.newRelationship(NS, 'SubmittedDentalClaim', adjudicateDentalClaim.submittedDentalClaim.$identifier);
            emit(event);
        })
        .catch(function (error) {
            console.log('Error: ' + error);
        });
}

/**
 * 
 * Get all the submitted claims
 * @param {org.acme.claim.GetAllSubmittedClaims} getAllSubmittedClaims - pay the adjudicated claim
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function getAllSubmittedClaims(getAllSubmittedClaims) {
// Get the vehicle asset registry.
    var NS = 'org.acme.claim';  
    return getAssetRegistry(NS + '.SubmittedDentalClaim')
    .then(function (submittedClaimAssetRegistry) {
    // Get all of the vehicles in the vehicle asset registry.
    return submittedClaimAssetRegistry.getAll();
    })
    .then(function (submittedClaims) {
    // Process the array of vehicle objects.
        submittedClaims.forEach(function (submittedClaim) {
            console.log(submittedClaim.claimId);
        });
    })
    .catch(function (error) {
    // Add optional error handling here.
    });
}

/**
 * Pay a claim
 * @param {org.acme.claim.PayDentalClaim} payDentalClaim - pay the adjudicated claim
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function payDentalClaim(payDentalClaim) {
    console.log('The adjudicated dental claim: ' + JSON.stringify(getSerializer().toJSON(payDentalClaim)));
    var theAdjudicatedDentalClaim = payDentalClaim.adjudicatedDentalClaim;
    var theAdjudicatedDentalClaimId = theAdjudicatedDentalClaim.getId();
    console.log('The adjudicated dental claimId: ' + theAdjudicatedDentalClaimId);
    if (payDentalClaim.adjudicatedDentalClaim.dentalClaimType != 'ENCOUNTER') {
        throw new Error('Only encounters can be paid');
    }
    var NS = 'org.acme.claim';
    var theFactory = getFactory();

    var thePayment = theFactory.newResource(NS, 'Payment', '1');
    thePayment.amount = theAdjudicatedDentalClaim.amount; // Just pay the amount
    thePayment.billingProvider = theFactory.newRelationship(NS, 'BillingProvider', theAdjudicatedDentalClaim.submittedDentalClaim.billingProviderNpi); 
    thePayment.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaimId);
    console.log('The payment: ' + JSON.stringify(getSerializer().toJSON(thePayment)));
    return getAssetRegistry(NS + '.AdjudicatedDentalClaim')
        .then(function(adjudicatedDentalClaimAssetRegistry) {
            theAdjudicatedDentalClaim.claimStatus = 'PAID'; 
            console.log('Update the adjudicated claim stats: ' + JSON.stringify(getSerializer().toJSON(theAdjudicatedDentalClaim)));
            return adjudicatedDentalClaimAssetRegistry.update(theAdjudicatedDentalClaim);
        })
        .then(function() {
            console.log('Payment asset registry promise');
            return getAssetRegistry(NS + '.Payment');
        })
        .then(function(paymentAssetRegistry) {
            console.log('Add the payment: ' + JSON.stringify(getSerializer().toJSON(thePayment)));
            return paymentAssetRegistry.add(thePayment);
        })
        .then(function() {
            console.log('Send the claim paid event');
            var event = theFactory.newEvent(NS, 'PayDentalClaimEvent');
            console.log('Adjudicated dental claim id: ' + theAdjudicatedDentalClaim.dentalClaimId);
            event.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaim.$identifier);
            event.payment = theFactory.newRelationship(NS, 'Payment', thePayment.$identifier);
            emit(event);
        })
        .catch(function (error) {
            console.log('Error paying dental claim' + error);
        });
}

/**
 * Handle a POST transaction, calling Node-RED running on Bluemix
 * @param {org.acme.claim.PostTransaction} postTransaction - the transaction to be processed
 * @transaction
 * @return {Promise} a promise that resolves when transaction processing is complete
 */
function handlePost(postTransaction) {
    var url = 'https://localhost:8080/claim';

    return post(url, postTransaction)
      .then(function (result) {
          alert(JSON.stringify(result));
          postTransaction.asset.value = 'Count is ' + result.body.sum;
          return getAssetRegistry(NS + '.AdjudicatedDentalClaim')
          .then(function (assetRegistry) {
              return assetRegistry.update(postTransaction.asset);
          });
      });
}
