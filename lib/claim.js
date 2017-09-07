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
 * @param {org.acme.claim.CreatePlan} createPlan - the setUp transaction instance
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function createPlan(createPlan) {
    console.log("Create some objects");
    var NS = 'org.acme.claim';
    var theFactory = getFactory();
// Create a Plan Address
    var aDentalPlanAddress = theFactory.newConcept(NS, 'Address');
    aDentalPlanAddress.addr1 = '2001 First Street';
    aDentalPlanAddress.city = 'Some City';
    aDentalPlanAddress.state = 'CA';
    aDentalPlanAddress.postcode = '94501';
// create the plan
    var theDentalPlan = theFactory.newResource(NS, 'DentalPlan', '1');
    theDentalPlan.name = 'Some primary dental plan';
    theDentalPlan.address = aDentalPlanAddress;
    console.log('Plan: ' + theDentalPlan);
    return getAssetRegistry(NS + '.DentalPlan')
    .then (function(planRegistry) {
        // add the plan
        console.log('Adding plan: ' + theDentalPlan);
        return planRegistry.addAll([theDentalPlan]);
    })
    .catch(function(error) {
        console.log('Error ' + error);
    });
}

/**
 * Create a group with two divisions
 * @param {org.acme.claim.CreateGroup} createGroup - create a group and divisions
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function createGroup(createGroup) {
    console.log("Create group");
    var NS = 'org.acme.claim';
    var theFactory = getFactory();
    var aGroupAddress = theFactory.newConcept(NS, 'Address');
    aGroupAddress.addr1 = '1333 Broadway';
    aGroupAddress.city = 'Some City';
    aGroupAddress.state = 'CA';
    aGroupAddress.postcode = '94501';
    // create the group
    var theGroup = theFactory.newResource(NS, 'Group', 'GRP1');
    theGroup.name = 'Some large group';
    theGroup.address = aGroupAddress;
    console.log('Group: ' + theGroup);
    // Create a division or two
    var aFirstDivision = theFactory.newResource(NS, 'Division', 'DIV1');
    var aSecondDivision = theFactory.newResource(NS, 'Division', 'DIV2');
    aFirstDivision.name = 'First Division';
    aSecondDivision.name = 'Second Division';
    aFirstDivision.address = aGroupAddress;
    aSecondDivision.address = aGroupAddress;
    aFirstDivision.group = theFactory.newRelationship(NS, 'Group', 'GRP1');
    aSecondDivision.group = theFactory.newRelationship(NS, 'Group', 'GRP1');
    theGroup.divisions = [];
    theGroup.divisions.push(theFactory.newRelationship(NS, 'Division', 'DIV1'));
    theGroup.divisions.push(theFactory.newRelationship(NS, 'Division', 'DIV2'));
    // Add them all
    return getAssetRegistry(NS + '.Division')
    .then(function(divisionRegistry) {
        // add the divisions
        console.log('Adding division1: ' + JSON.stringify(getSerializer().toJSON(aFirstDivision)));  
        console.log('Adding division2: ' + JSON.stringify(getSerializer().toJSON(aSecondDivision)));                                                                     
        return divisionRegistry.addAll([aFirstDivision, aSecondDivision]);
    })
    .then (function() {
        return getAssetRegistry(NS + '.Group');
    })
    .then(function (groupRegistry) {
        console.log('Adding group: ' + JSON.stringify(getSerializer().toJSON(theGroup)));                                                                    
        return groupRegistry.addAll([theGroup]);
    })
    .catch(function(error) {
        console.log('Error ' + error);
    });
}

/**
 * Set up the run
 * @param {org.acme.claim.CreateBillingProvider} createBillingProvider - the setUp transaction instance
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function createBillingProvider(billingProvider) {
    console.log("Create some objects");
    var NS = 'org.acme.claim';
    var theFactory = getFactory();
    // Billing provider name
    var aProviderName = theFactory.newConcept(NS, 'Name');
    aProviderName.title = 'Ms';
    aProviderName.firstName = 'Helen';
    aProviderName.lastName = 'Fox';
    // create the BillingProvider
    var billingProvider = theFactory.newResource(NS, 'BillingProvider', '1'); // TODO createResource?
    billingProvider.name = aProviderName;
    billingProvider.tin = '555-1212';
    console.log('Billing provider ' + billingProvider);
    return getParticipantRegistry(NS + '.BillingProvider')
    .then(function(billingProviderRegistry) {
        // add the billingProviders
        console.log('Adding billing provider: ' + billingProvider);                                                                     
        return billingProviderRegistry.addAll([billingProvider]);
    })
    .catch(function(error) {
        console.log('Error ' + error);
    });
}

/**
 * Set up the run
 * @param {org.acme.claim.CreateSubscriber} createSubscriber - the setUp transaction instance
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function createSubscriber(subscriber) {
    console.log("Create a subscriber object");
    var NS = 'org.acme.claim';
    var theFactory = getFactory();
    // Create the subscriber
    var theSubscriber = theFactory.newResource(NS, 'Subscriber', '1');
    // Name
    var theSubscriberName = theFactory.newConcept(NS, 'Name');
    theSubscriberName.firstName = 'John';
    theSubscriberName.lastName = 'Smith';
    theSubscriber.name = theSubscriberName;
    // Address
    var theSubscriberAddress = theFactory.newConcept(NS, 'Address');
    theSubscriberAddress.addr1 = '123 Street';
    theSubscriberAddress.city = 'Some City';
    theSubscriberAddress.state = 'CA';
    theSubscriberAddress.postcode = '94501';
    theSubscriberAddress.postcode = '94501';
    theSubscriber.address = theSubscriberAddress;
    // Comms
    theSubscriber.electronicCommunications = [];
    var theElectronicCommunication = theFactory.newConcept(NS, 'ElectronicCommunication');
    theElectronicCommunication.communicationMethod = 'EMAIL';
    theElectronicCommunication.emailAddress = 'ajb@blakey.org';
    theSubscriber.electronicCommunications.push(theElectronicCommunication);
    // Phone
    theSubscriber.phones = [];
    var thePhone = theFactory.newConcept(NS, 'Phone');
    thePhone.number = '555-1212';
    thePhone.phoneType = 'MOBILE_PHONE';
    theSubscriber.phones.push(thePhone);
    // Gender
    theSubscriber.gender = 'MALE';
    // DofB
    theSubscriber.dateOfBirth = new Date('1976/10/10'); // Some date
    // SSN
    theSubscriber.socialSecurityNumber = '123-90-7867';
    // Employer
    theSubscriber.employer = 'ABC Company';
    // Output
    console.log('Subscriber: ' + JSON.stringify(getSerializer().toJSON(theSubscriber)));
    return getParticipantRegistry(NS + '.Subscriber')
    .then(function(subscriberRegistry) {
        return subscriberRegistry.addAll([theSubscriber]);
    })  
    .catch(function(error) {
        console.log('Error ' + error);
    });
}

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
    var anEnrolleeName = theFactory.newConcept(NS, 'Name');
    anEnrolleeName.firstName = 'John';
    anEnrolleeName.lastName = 'Smith';
    submittedDentalClaim.enrolleeName = anEnrolleeName;
    var anEnrolleeClaimAddress = theFactory.newConcept(NS, 'Address');
    anEnrolleeClaimAddress.addr1 = '123 Street';
    anEnrolleeClaimAddress.city = 'Some City';
    anEnrolleeClaimAddress.state = 'CA';
    anEnrolleeClaimAddress.postcode = '94501';
    submittedDentalClaim.enrolleeAddress = anEnrolleeClaimAddress;
    submittedDentalClaim.enrolleeDateOfBirth = new Date('1990/11/1');
    submittedDentalClaim.enrolleeGender = 'MALE';
    submittedDentalClaim.enrolleeId = '100';
    submittedDentalClaim.planOrGroupNumber = '123';
    submittedDentalClaim.employerName = 'Some Company';                       
// Patient information
    submittedDentalClaim.patientsRelationshipToPolicyHolder = 'SELF';
    if (submittedDentalClaim.patientsRelationshipToPolicyHolder === 'SELF') {
        submittedDentalClaim.patientName = submittedDentalClaim.enrolleeName;                  
        submittedDentalClaim.patientAddress = submittedDentalClaim.enrolleeAddress;
        submittedDentalClaim.patientDateOfBirth = submittedDentalClaim.enrolleeDateOfBirth;
        submittedDentalClaim.patientGender = submittedDentalClaim.enrolleeGender;
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
    submittedDentalClaim.patientGuardianSignature = true;
    submittedDentalClaim.subscriberSignature = true; 
    submittedDentalClaim.placeOfTreatmentCode = 11; // office
    // Billing provider
    var aBillingProviderName = theFactory.newConcept(NS, 'Name');
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
    submittedDentalClaim.billingProviderNpi = '2222222222';
    submittedDentalClaim.billingProviderLicense = 'CA 42';
    submittedDentalClaim.billingProviderTin = '23-789';
    submittedDentalClaim.billingProviderPhoneNumber = '415-555-1212';
    // Treating provider
    var aTreatingProviderName = theFactory.newConcept(NS, 'Name');
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
    // Create a Payment object
    // Copy the claim amount into the payment
    // Create a new adjudicatedclaim 
    // var theAdjudicatedClaim = new AdjudicatedClaim();
    // Reference the submittedClaim from the adjudicatedClaim
    // theAdjudicatedClaim.submittedClaim = submittedClaim;
    // Reference the payment from the adjudicated claim
    // theAdjudicatedClaim.payment = thePayment;
    // Send a claim paid event
    // var theClaimEvent = new ClaimEvent();
    // theClaimEvent.adjudicatedClaim = theAdjudicatedClaim;
    // theClaimEvent.submittedClaim = submittedClaim;

    var NS = 'org.acme.claim';
    var theFactory = getFactory();
    var theAdjudicatedDentalClaim = theFactory.newResource(NS, 'AdjudicatedDentalClaim', '1');
    theAdjudicatedDentalClaim.claimStatus = 'HELD';
    theAdjudicatedDentalClaim.amount = adjudicateDentalClaim.submittedDentalClaim.amount;
    theAdjudicatedDentalClaim.submittedDentalClaim = theFactory.newRelationship(NS, 'SubmittedDentalClaim', adjudicateClaim.submittedClaim.claimId);
           
    var theBillingProviderId = adjudicateDentalClaim.submittedDentalClaim.billingProvider.npi;

    return getAssetRegistry(NS + '.AdjudicatedDentalClaim')
        .then(function (adjudicatedDentalClaimAssetRegistry) {
            console.log('Add the new adjudicated dental claim: ' + theAdjudicatedDentalClaim);
            return adjudicatedDentalClaimAssetRegistry.add(theAdjudicatedDentalClaim);
        })
        .then(function() {
            console.log('Send the dental claim event');
            var event = theFactory.newEvent(NS, 'StartAdjudicationEvent');
            event.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaim.dentalClaimId);
            event.submittedDentalClaim = theFactory.newRelationship(NS, 'SubmittedDentalClaim', adjudicateDentalClaim.submittedDentalClaim.dentalClaimId);
            emit(event);
        })
        .catch(function (error) {
            console.log('Error: ' + error);
        });
}

/**
 * Pay a claim
 * @param {org.acme.claim.PayDentalClaim} payDentalClaim - pay the adjudicated claim
 * @return {Promise} Asset Registry Promise
 * @transaction
 */
function payDentalClaim(payDentalClaim) {
    if (payDentalClaim.adjudicatedDentalClaim.dentalClaimType != 'ENCOUNTER') {
        throw new Error('Only encounters can be paid');
    }
    var NS = 'org.acme.claim';
    var theFactory = getFactory();
    var theAdjudicatedDentalClaim = payDentalClaim.adjudicatedDentalClaim;
    console.log('Adjudicated dental claim: ' + theAdjudicatedDentalClaim);
    console.log('Create a payment');
    var thePayment = theFactory.newResource(NS, 'Payment', '1');
    thePayment.amount = theAdjudicatedDentalClaim.amount; // Just pay the amount
    thePayment.billingProvider = theFactory.newRelationship(NS, 'BillingProvider', theAdjudicatedDentalClaim.submittedDentalClaim.billingProvider.npi); 
    thePayment.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaim.dentalClaimId);
    console.log('The payment: ' + thePayment);
    return getAssetRegistry(NS + '.AdjudicatedDentalClaim')
        .then(function(adjudicatedDentalClaimAssetRegistry) {
            theAdjudicatedDentalClaim.claimStatus = 'PAID'; 
            console.log('Update the adjudicated claim stats: ' + theAdjudicatedDentalClaim);
            return adjudicatedDentalClaimAssetRegistry.update(theAdjudicatedDentalClaim);
        })
        .then(function() {
            console.log('Payment asset registry promise');
            return getAssetRegistry(NS + '.Payment');
        })
        .then(function(paymentAssetRegistry) {
            console.log('Add the payment: ' + thePayment);
            return paymentAssetRegistry.add(thePayment);
        })
        .then(function() {
            console.log('Send the claim paid event');
            var event = theFactory.newEvent(NS, 'PayDentalClaimEvent');
            console.log('Adjudicated dental claim id: ' + theAdjudicatedDentalClaim.dentalClaimId);
            event.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaim.dentalClaimId);
            event.payment = theFactory.newRelationship(NS, 'Payment', thePayment.paymentId);
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

/**
 * Enroll one or more members that are either subscribers or members or both
 * @param {org.acme.claim.AddEnrollees} addEnrollees - the transaction to be processed
 * @transaction
 * @return {Promise} a promise that resolves when transaction processing is complete
 */
function addEnrollees(addEnrollees) {
    // 
    var theEnrollmentHeader = enrollmentAdditions.header; // We are going to enroll everyone in the same plan?
    // From the header 
    // Value search for the payer/plan name, if not found throw and error
    // Value search for the lowest org - either group or division
    // Value search for the broker
    // Iterate through the enrollment additions
    // For subscriber types
    // Create the subscriber and the SubscriberPlan
    // Iterate through the enrollment additions
    // For the dependents - add them to the subscriber and the subscriber plan

  }