# Claims Processing Business Network

> This is a proof of concept, which demonstrates the core functionality of Hyperledger Composer by modelling
a health care claims processing system, specifically using dental claims. Processing a claim is extremely
complex involing several processing steps, some of which need to refer to value of assets that belong in
other ledgers/channels. 

This business network defines:

**Participant**
`SampleParticipant`

**Asset**
`Claim` - abstract supertype of all the claims types.
`DentalClaim` - abstract supertype of the dental claims - namely submitted and adjudicated. A complete model shall have medical, hosptial, pharmacy etc. claim types, which would also extend Claim.
`SubmittedDentalClaim` - a representation of a ADA dental claims form, that captures the claims input and
is a record of the receipt from the provider that submits the claim.
`DentalClaimAttachment` - represents additional informaiton that supports the claim. This might be such
things as doctors notes, X-Ray images, DICOM files etc. this encapsulates a Blob "type" which is modelled as a concept.
`SubmittedDentalServiceLine` - mutiple instances of these, referenced from the Submitted DentalClaim represent
the services delivered under the submimtted claim. These itemize the specific services. The line contains a 
fee - which is the amount the provider is billing the payer and hopes to receive - the actual amout is
determined by the contract the provider has with the payer and what the payer has agreed to pay undder the 
terms of a contract with the insured group. The type of the fee is a concept - BigDecimal - which represents fixed point decimal numbers. This is a compromise in abeyance of either a builtin type or support for an extensible type system.
`AdjudicatedDentalClaim` - this asset represents the claim as it is transformed dring several processing
steps (the adjudication) from the point at which it is submitted to the point at which a payment is made
to whomever is nomimated to receive the payment.
`AdjudicatedDentalServiceLine` - this corresponds to the submitted service lines, although there maybe a
one to many relationship between the adjudicate line and the submitted lines. In the model so far only
the back reference from the adjudicated line to the submited line is maintained. Each adjudicated 
line is a result of the adjudication processing and it forms a record of the chnages the adjudication
perfomed on the claim. A line might add state the amount to be paid for a specific service line, and then 
later in the processing a subsequent line might indicate a reduction in the service payment based on
further assessment. The eventual payment is made by totally all adudicated service line 
containing both positive (credits) and negative (debits) payments for the specific service.
`Payment` - this represents money that gets paid to the beneficairy of the claim - this might be the provider or the member, depdending upon the contracts.

**Participants**

`HumanProvider` - a human provider is named to distinguish it from a Provider which in medical
terminology can sometimes refer both to a human and a facility at which medical services can be provided. A human provider participant will also be represented fully in a provider channel/ledger.
`BillingProvider` - this is the provider that submits the claim and to whom payments are rendered.
`Member` - is anyone who is a coverged by insurance, and might be either the subscriber or a depdendent of
the subscriber - TODO is this needed? must this be the same model as the membership model?
`Subscriber` - this is the person covered by the helth isurance policy agsint which the claim
is submitted and is potentially someone who coud receive payment for the claim depending on the 
terms of the contract with the provider.

**Transaction**
`CreateSubmittedClaim` - creates a submitted claim to start the process.
`AdjudicateDentalClaim` - this processes the submitted claim, the processing starts by creating an ajudicated
claim from the submitted claim and then evaluating it against the terms of a contract. If the claim
is a pre-dtermination the result is an estimated payment, else the result is a payment or the claim is placed into a pend state in abyeance of additional information.
`PayDentalClaim` - this pays the claim by sending a payment to the designated payee of the adjudicated claim.
`PaymentCredits` - these are payment adjustments that are returned to the payer as over payments of some type,
and might appear from the AR system.

**Event**
`PayClaimEvent` - notifiy a participant that the claim has been paid.

A billing provider submits claims to the system to be paid or adjudicated. Once the claim 
is submitted the adjudication processes is run against the claim. 
If the claim type is a pre-determination the claim is asessed and a
amount returned that would be paid if the claim is submitted as an encounter.
If the claim is submitted as an encounter it's processed and a payment generated. The payment is made to the billing provider by running the payment transaction on the adjudicated claim that must be in a 
"payable" state.


To test this Business Network Definition in the **Test** tab:

Create a `BillingProvider` participant:

```
{
  "$class": "org.acme.claim.BillingProvider",
  "participantId": "Toby",
  "firstName": "Tobias",
  "lastName": "Hunter"
}
```

Create a `SubmittedDentalClaim` asset:

```
{
  "$class": "org.acme.claim.SubmittedDentalClaim",
  "assetId": "assetId:1",
  "owner": "resource:org.acme.sample.SampleParticipant#Toby",
  "value": "original value"
}
```

Submit a `AdjudicateDentalClaim` transaction:

```
{
  "$class": "org.acme.claim.AdjudicateDentalClaim",
}
```

Submit a `PayDentalClaim` transaction to pay the claim.

After submitting this transaction, you should now see the transaction in the Transaction Registry and that a `AdjudicatedDentalClaim` and `Payment` have been emitted. As a result, the value of the `assetId:1` should now be `new value` in the Asset Registry.

