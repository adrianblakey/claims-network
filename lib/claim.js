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
 * @transaction
 */
async function createSubmittedClaim(createSubmittedClaim) {
    const NS = 'org.acme.claim';
    const theFactory = getFactory();
    // Create a submitted dental claim
    console.log('Create a submitted dental claim - id = 1');
    let submittedDentalClaim = theFactory.newResource(NS, 'SubmittedDentalClaim', '1');
    const val = submittedDentalClaim.getClassDeclaration().getDecorator('description').getArguments()[0];
    console.log('SubmittedDentalClaims decorator: ' + val);
    submittedDentalClaim.dentalClaimType = 'ENCOUNTER';
    // Predetermination is omitted
    submittedDentalClaim.planName = 'Some primary dental plan';
    // Create a Plan Address
    let aPlanAddress = theFactory.newConcept(NS, 'Address');
    aPlanAddress.addr1 = '123 Street';
    aPlanAddress.city = 'Some City';
    aPlanAddress.state = 'CA';
    aPlanAddress.postcode = '94501';
    submittedDentalClaim.planName = 'Some primary dental plan';
    submittedDentalClaim.planAddress = aPlanAddress;
    // Other coverage omitted 
    // Policyholder/subscriber information
    // Name
    let aMemberName = theFactory.newConcept(NS, 'HumanName');
    aMemberName.firstName = 'John';
    aMemberName.lastName = 'Smith';
    submittedDentalClaim.memberName = aMemberName;
    let aMemberClaimAddress = theFactory.newConcept(NS, 'Address');
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
    theSubmittedDentalServiceLines = []; // Objects to save
    let totalIntegerPart = 0;
    let totalFractionPart = 0;
    let toothNumber = 10;
    for (let i = 0; i < 3; i++) {
        let aSubmittedDentalServiceLine = theFactory.newResource(NS, 'SubmittedDentalServiceLine', 'SL' + i);
        theSubmittedDentalServiceLines.push(aSubmittedDentalServiceLine);
        let aSubmittedDentalServiceLineReln = theFactory.newRelationship(NS, 'SubmittedDentalServiceLine', 'SL' + i);
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
        let aServiceLineFee = theFactory.newConcept(NS, 'BigDecimal');
        aServiceLineFee.integerPart = 51 * 2 * i;
        aServiceLineFee.fractionPart = 98 + i; // Just create some value that will overflow
        totalIntegerPart += aServiceLineFee.integerPart;
        totalFractionPart += aServiceLineFee.fractionPart;
        aSubmittedDentalServiceLine.fee = aServiceLineFee;
        console.log('Service line: ' + JSON.stringify(getSerializer().toJSON(aSubmittedDentalServiceLine)));
        submittedDentalClaim.submittedDentalServiceLines.push(aSubmittedDentalServiceLineReln);
    }
    let theTotalFees = theFactory.newConcept(NS, 'BigDecimal');
    // Add the total 
    theTotalFees.integerPart = totalFractionPart / 100; // Capture the overflow
    theTotalFees.fractionPart = totalFractionPart - theTotalFees.integerPart; // Subtract the overflow
    theTotalFees.integerPart += totalIntegerPart;
    //
    submittedDentalClaim.totalFees = theTotalFees;
    submittedDentalClaim.amount = 21.21; // TODO remove this !
    submittedDentalClaim.patientGuardianSignature = true;
    submittedDentalClaim.subscriberSignature = true;
    submittedDentalClaim.placeOfTreatmentCode = 11; // office
    // Billing provider
    let aBillingProviderName = theFactory.newConcept(NS, 'HumanName');
    aBillingProviderName.firstName = 'Joan';
    aBillingProviderName.lastName = 'Smythe';
    console.log('Billing provider name: ' + aBillingProviderName);
    submittedDentalClaim.billingProviderName = aBillingProviderName;
    // Billing provider address
    let aBillingProviderAddress = theFactory.newConcept(NS, 'Address');
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
    let aTreatingProviderName = theFactory.newConcept(NS, 'HumanName');
    aTreatingProviderName.firstName = 'John';
    aTreatingProviderName.lastName = 'Smith';
    console.log('Treating provider name: ' + aTreatingProviderName);
    submittedDentalClaim.treatingProviderName = aTreatingProviderName;
    // Treating provider details
    submittedDentalClaim.treatingProviderNpi = '1234567890';
    submittedDentalClaim.treatingProviderLicense = 'CA 1234';
    submittedDentalClaim.treatingProviderPhoneNumber = '415-555-1212';
    // Treating provider address
    let aTreatingProviderAddress = theFactory.newConcept(NS, 'Address');
    aTreatingProviderAddress.addr1 = '123 Street';
    aTreatingProviderAddress.city = 'Some City';
    aTreatingProviderAddress.state = 'CA';
    aTreatingProviderAddress.postcode = '94501';
    submittedDentalClaim.treatingProviderAddress = aTreatingProviderAddress;
    // Write it to the ledger
    console.log('Submitted claim: ' + JSON.stringify(getSerializer().toJSON(submittedDentalClaim)));
    const submittedDentalServiceLineRegistry = await getAssetRegistry(NS + '.SubmittedDentalServiceLine');
    await submittedDentalServiceLineRegistry.addAll(theSubmittedDentalServiceLines);
    const submittedClaimRegistry = await getAssetRegistry(NS + '.SubmittedDentalClaim');
    console.log('Adding submitted dental claim: ' + submittedDentalClaim);
    await submittedClaimRegistry.addAll([submittedDentalClaim]);
}

/**
 * Adjudicate a claim
 * @param {org.acme.claim.AdjudicateDentalClaim} adjudicateDentalClaim - the adjudicateDentalClaim transaction instance
 * @transaction
 */
async function adjudicateDentalClaim(adjudicateDentalClaim) {
    /*
    // TODO This is a 10 step process ...
    1. Field edits
    2. Membership eligibility
    3. Provider eligibility
    4. Duplicate claim checking
    5. Benefit and referral eligibility
    6. Pricing resolution
    7. Benefit resolution
    8. Coordination of benefits (COB) resolution
    9. End of line resolution
    10. File updates
    */
    // Create an adjudicated claim that references the submitted claim - lame PoC
    const NS = 'org.acme.claim';
    const theFactory = getFactory();
    let theAdjudicatedDentalClaim = theFactory.newResource(NS, 'AdjudicatedDentalClaim', '1');
    theAdjudicatedDentalClaim.claimStatus = 'HELD';
    theAdjudicatedDentalClaim.dentalClaimType = 'ENCOUNTER';
    theAdjudicatedDentalClaim.amount = adjudicateDentalClaim.submittedDentalClaim.amount; // TODO this needs to be a big decimal!
    theAdjudicatedDentalClaim.submittedDentalClaim = theFactory.newRelationship(NS, 'SubmittedDentalClaim', adjudicateDentalClaim.submittedDentalClaim.$identifier);
    console.log('Add the new adjudicated dental claim: ' + theAdjudicatedDentalClaim);
    const adjudicatedDentalClaimAssetRegistry = awaitgetAssetRegistry(NS + '.AdjudicatedDentalClaim');
    console.log('Add the new adjudicated dental claim: ' + theAdjudicatedDentalClaim);
    await adjudicatedDentalClaimAssetRegistry.add(theAdjudicatedDentalClaim);
    console.log('Send the dental claim event for ac id: ' + theAdjudicatedDentalClaim.claimId);
    let event = theFactory.newEvent(NS, 'StartAdjudicationEvent');
    event.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaim.claimId);
    event.submittedDentalClaim = theFactory.newRelationship(NS, 'SubmittedDentalClaim', adjudicateDentalClaim.submittedDentalClaim.$identifier);
    emit(event);
}

/**
 * Get all the submitted claims.
 * @param {org.acme.claim.GetAllSubmittedClaims} getAllSubmittedClaims - return all submitted claims ids
 * @transaction
 */
async function getAllSubmittedClaims(getAllSubmittedClaims) {
    const NS = 'org.acme.claim';
    //var theFactory = getFactory();
    //var theGetSubmittedClaim = theFactory.newTransaction(NS, 'GetSubmittedClaim');
    const submittedClaimAssetRegistry = await getAssetRegistry(NS + '.SubmittedDentalClaim');
    const submittedClaims = await submittedClaimAssetRegistry.getAll();
    submittedClaims.forEach(function (submittedClaim) {
                console.log("The Claim id: " + submittedClaim.claimId);
                console.log("The Claim $id: " + submittedClaim.$identifier);
                console.log(JSON.stringify(getSerializer().toJSON(submittedClaim)));
                theGetSubmittedClaim.dentalClaimId = submittedClaim.$identifier;
                /*
                getAssetRegistry(NS + '.GetSubmittedClaim')
                    .then(function (getSubmittedClaimAssetRegistry) {
                        console.log("Do something to dispatch the get claim by id");
                    });
                */
    });
}

/**
 * Get a submitted claim and traverse down through the claims lines
 * @param {org.acme.claim.GetSubmittedClaim} getSubmittedClaim - pay a single submitted claim by id
 * @transaction
 */
async function getSubmittedClaim(getSubmittedClaim) {
    const NS = 'org.acme.claim';
    const submittedClaimAssetRegistry = await getAssetRegistry(NS + '.SubmittedDentalClaim');
    const submittedClaim = await submittedClaimAssetRegistry.get(getSubmittedClaim.dentalClaimId);
    console.log(JSON.stringify(getSerializer().toJSON(submittedClaim)));
    let theSubmittedDentalServiceLines = submittedClaim.submittedDentalServiceLines;
    console.log("The first service line: " + theSubmittedDentalServiceLines[0]);
    const submittedDentalServiceLineRegistry = await getAssetRegistry(NS + '.SubmittedDentalServiceLine');
    submittedDentalServiceLines.forEach(function (submittedDentalServiceLine) {
        console.log("The submitted service line: " + submittedDentalServiceLine);
        console.log("SL id: " + submittedDentalServiceLine.$identifier);
        let slId = submittedDentalServiceLine.$identifier;
        let aServLine = submittedDentalServiceLineRegistry.get(slId);
        console.log("The SL: " + JSON.stringify(getSerializer().toJSON(submittedDentalServiceLine)));
    });
}

/**
 * Pay a claim
 * @param {org.acme.claim.PayDentalClaim} payDentalClaim - pay the adjudicated claim
 * @transaction
 */
async function payDentalClaim(payDentalClaim) {
    console.log('The adjudicated dental claim: ' + JSON.stringify(getSerializer().toJSON(payDentalClaim)));
    const theAdjudicatedDentalClaim = payDentalClaim.adjudicatedDentalClaim;
    const theAdjudicatedDentalClaimId = theAdjudicatedDentalClaim.getId();
    console.log('The adjudicated dental claimId: ' + theAdjudicatedDentalClaimId);
    if (payDentalClaim.adjudicatedDentalClaim.dentalClaimType != 'ENCOUNTER') {
        throw new Error('Only encounters can be paid');
    }
    const NS = 'org.acme.claim';
    const theFactory = getFactory();

    let thePayment = theFactory.newResource(NS, 'Payment', '1');
    thePayment.amount = theAdjudicatedDentalClaim.amount; // Just pay the amount
    thePayment.billingProvider = theFactory.newRelationship(NS, 'BillingProvider', theAdjudicatedDentalClaim.submittedDentalClaim.billingProviderNpi);
    thePayment.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaimId);
    console.log('The payment: ' + JSON.stringify(getSerializer().toJSON(thePayment)));
    const adjudicatedDentalClaimAssetRegistry = await getAssetRegistry(NS + '.AdjudicatedDentalClaim');
    theAdjudicatedDentalClaim.claimStatus = 'PAID';
    console.log('Update the adjudicated claim status: ' + JSON.stringify(getSerializer().toJSON(theAdjudicatedDentalClaim)));
    await adjudicatedDentalClaimAssetRegistry.update(theAdjudicatedDentalClaim);
    console.log('Payment asset registry promise');
    const paymentAssetRegistry = await getAssetRegistry(NS + '.Payment');
    console.log('Add the payment: ' + JSON.stringify(getSerializer().toJSON(thePayment)));
    await paymentAssetRegistry.add(thePayment);
    console.log('Send the claim paid event');
    let event = theFactory.newEvent(NS, 'PayDentalClaimEvent');
    console.log('Adjudicated dental claim id: ' + theAdjudicatedDentalClaim.dentalClaimId);
    event.adjudicatedDentalClaim = theFactory.newRelationship(NS, 'AdjudicatedDentalClaim', theAdjudicatedDentalClaim.$identifier);
    event.payment = theFactory.newRelationship(NS, 'Payment', thePayment.$identifier);
    emit(event);
}

/**
 * Handle a POST transaction, calling Node-RED running on Bluemix??
 * @param {org.acme.claim.PostTransaction} postTransaction - the transaction to be processed
 * @transaction
 */
async function handlePost(postTransaction) {
    const url = 'https://localhost:8080/claim';
    const result = await post(url, postTransaction);
    alert(JSON.stringify(result));
    postTransaction.asset.value = 'Count is ' + result.body.sum;
    const assetRegistry = await getAssetRegistry(NS + '.AdjudicatedDentalClaim');
    await assetRegistry.update(postTransaction.asset);  
}