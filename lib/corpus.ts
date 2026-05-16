// Federal rules corpus + state external review cheat sheet.
// Injected into the system prompt so Claude can cite by id.

export const FEDERAL_RULES = `
ACA-2719  —  ACA Internal & External Appeals (29 USC §1185d, 45 CFR §147.136)
Under §2719 of the Public Health Service Act (added by the Affordable Care Act),
non-grandfathered group and individual health plans must provide:
  - An internal claims and appeals process compliant with DOL claims procedure
    regulations.
  - A right to an independent external review by an IRO (Independent Review
    Organization) when the internal appeal is unsuccessful, for any adverse
    benefit determination involving medical judgment or rescission.
  - Written notice in a culturally and linguistically appropriate manner.
  - Continued coverage pending the outcome of the internal appeals process.
Deadlines: 180 days from the adverse benefit determination to file internal
appeal. 4 months from internal final denial to file external review. Expedited
review available within 72 hours for urgent care.
Insurer must respond: 30 days for pre-service, 60 days for post-service, 72
hours for urgent.

NSA-2799  —  No Surprises Act (PHSA §2799A, §9816 IRC, §716 ERISA)
Effective January 1, 2022. Protects patients from surprise medical bills for:
  - Emergency services at out-of-network facilities or by out-of-network
    providers.
  - Non-emergency services by out-of-network providers at in-network facilities
    (unless patient gave written notice & consent ≥72 hours in advance).
  - Air ambulance services by out-of-network providers.
Patient cost-sharing must be calculated as if the service were in-network.
Balance billing prohibited. If a balance bill is received in violation,
patient may dispute and providers/payers enter the federal IDR process.

NSA-2799-IDR  —  Federal Independent Dispute Resolution
30-day open negotiation period after the initial payment or denial. If
unresolved, either party may initiate IDR within 4 business days after the
end of negotiation. Certified IDR entity selects one of the two offers
(baseball arbitration). Decision binding.

ERISA-503  —  ERISA Fiduciary Duty on Claims (29 USC §1133, 29 CFR §2560.503-1)
Self-funded employer plans regulated under ERISA must:
  - Provide a "full and fair review" of denied claims.
  - On request, provide all documents, records, and other information
    relevant to the claim, free of charge, including:
       * the specific plan provisions on which the denial is based,
       * any internal rule, guideline, protocol, or criterion relied on,
       * any clinical judgment or medical necessity determination,
       * names and credentials of medical experts consulted.
  - Disclose the standard of review applied.
  - Issue written notice of denial within 30 days (pre-service) or
    60 days (post-service); within 72 hours for urgent care.
LEVER: A self-funded employer plan that denies a claim without producing the
above documents on request has breached ERISA fiduciary duty. Patients should
request these documents in writing during the appeal.

MEDICARE-422  —  Medicare Advantage Organization Determinations & Reconsiderations
(42 CFR §422 Subpart M)
Members may request an Organization Determination (OD) for any service or
payment. If denied, members have 60 days to file a Reconsideration. If still
denied, the case is automatically forwarded to an Independent Review Entity
(IRE) (currently Maximus Federal). Further appeal: ALJ hearing, MAC review,
federal court. Expedited review within 72 hours when standard timeframe
jeopardizes life or function.

MEDICARE-PARTD  —  Medicare Part D Coverage Determination & Redetermination
(42 CFR §423 Subpart M)
Member or prescriber may request a coverage determination. Denial allows
Redetermination within 60 days, then IRE Reconsideration. Expedited review
available.

MEDICAID-431  —  Medicaid Fair Hearing Rights (42 CFR §431 Subpart E)
Medicaid recipients are entitled to a state fair hearing on any adverse
action affecting eligibility or benefits. Must be requested within 90 days
of the notice (states may extend). Hearing must occur within 90 days
of request (45 days for SNAP-linked benefits). Continued benefits during
appeal if request filed within timely-filing window.

STATE-MATRIX  —  State External Review Process
After internal appeal exhaustion under ACA-2719, the patient files external
review with the state-designated IRO via the state Department of Insurance
or via the federal external review process. State-specific deadlines and
contacts are listed in STATE_EXTERNAL_REVIEW.

POLICY-MEDICAL-NECESSITY  —  Medical Necessity Denial Patterns
The most common denial reason. Insurers cite InterQual or MCG criteria.
Strong appeal levers:
  - Treating physician's clinical judgment (with letter of medical necessity).
  - Specialty guideline citation (e.g., ASCO, AHA, NCCN).
  - Mismatch between criteria version and the patient's actual presentation.
  - Failure of step therapy when documented contraindication exists.
  - Insurer's failure to involve a same-specialty reviewer.

POLICY-EXPERIMENTAL  —  Experimental/Investigational Denial Patterns
Insurers often deny non-formulary or off-label therapies as "experimental."
Strong appeal levers:
  - FDA approval for the indication.
  - Compendia listing (NCCN, DrugDex, AHFS) for off-label uses.
  - Peer-reviewed evidence + treating physician attestation.
  - Compassionate use precedent.

POLICY-PRIOR-AUTH  —  Prior Authorization Denial Patterns
Strong appeal levers:
  - Service was urgent / emergent — prior auth not required under EMTALA.
  - Insurer's PA rule conflicts with state law (multiple states now restrict PA).
  - PA criteria not disclosed prior to denial (state transparency laws).
  - Patient was misinformed by member services on coverage scope.

POLICY-PRESCRIPTION  —  Prescription Drug Denial Patterns
Strong appeal levers:
  - Step therapy completed or contraindicated.
  - Formulary exception via prescriber attestation.
  - Continuity of care from prior plan.
  - 30-day emergency fill protection.

ERISA-FIDUCIARY-DEMAND
Standard paragraph to include in any appeal involving a self-funded employer plan:
"Pursuant to 29 USC §1133 and 29 CFR §2560.503-1, I formally request the
following documents within 30 days: (1) the specific plan provisions on which
the denial is based; (2) any internal rule, guideline, protocol, or criterion
relied on in making the determination; (3) the name and credentials of any
medical expert whose advice was obtained in connection with the determination,
whether or not the advice was relied upon; (4) an explanation of the scientific
or clinical judgment for the determination, applying the terms of the plan to
the claimant's medical circumstances. Failure to produce these documents is a
breach of ERISA fiduciary duty."
`;

export const STATE_EXTERNAL_REVIEW = `
Format: STATE | Days to file external review | Reviewing body | Notes

AL | 4 months | AL Dept of Insurance via federal IRO | Standard ACA
AK | 4 months | Federal external review process | Uses federal IRO
AZ | 4 months | AZ Dept of Insurance | Expedited 72 hrs
AR | 4 months | AR Insurance Department external review | State IRO list
CA | 6 months | DMHC IMR (Independent Medical Review) | Strong consumer protections; free to consumer
CO | 4 months | CO Division of Insurance | State IROs
CT | 4 months | CT Insurance Department | State-specific form
DE | 4 months | DE Dept of Insurance | Standard ACA
FL | 4 months | Federal IRO process | Subsidiary disclosure required
GA | 60 days | GA Dept of Insurance | Tight deadline; expedited 72 hrs
HI | 4 months | HI Insurance Division | Standard ACA
ID | 4 months | ID Dept of Insurance | Standard ACA
IL | 4 months | IL Department of Insurance | Strong external review
IN | 4 months | IN Dept of Insurance | Standard
IA | 4 months | IA Insurance Division | Standard
KS | 4 months | KS Insurance Department | Standard
KY | 4 months | KY Dept of Insurance | Standard
LA | 4 months | LA Dept of Insurance | Standard
ME | 4 months | ME Bureau of Insurance | Standard
MD | 4 months | MD Insurance Administration | Strong consumer-facing process
MA | 4 months | MA Office of Patient Protection (OPP) | Free external review
MI | 127 days | MI Dept of Insurance & Financial Services | DIFS
MN | 4 months | MN Dept of Commerce | Strong external review
MS | 4 months | Federal IRO | Federal default
MO | 4 months | MO Department of Insurance | Standard
MT | 4 months | MT State Auditor's Office | Standard
NE | 4 months | NE Dept of Insurance | Standard
NV | 4 months | NV Division of Insurance | Standard
NH | 180 days | NH Insurance Department | Longer window
NJ | 4 months | NJ Dept of Banking and Insurance IHCAP | Independent Health Care Appeals Program
NM | 4 months | NM Office of Superintendent of Insurance | Standard
NY | 4 months | NY Dept of Financial Services | Strong external appeal; $25 fee
NC | 120 days | NC Dept of Insurance Smart NC | Free consumer ombudsman
ND | 4 months | ND Insurance Department | Standard
OH | 180 days | OH Dept of Insurance | Standard
OK | 4 months | OK Insurance Department | Standard
OR | 4 months | OR Division of Financial Regulation | Standard
PA | 4 months | PA Insurance Department | Standard
RI | 4 months | RI Office of the Health Insurance Commissioner | Standard
SC | 4 months | SC Dept of Insurance | Standard
SD | 4 months | SD Division of Insurance | Standard
TN | 4 months | TN Dept of Commerce and Insurance | Standard
TX | 4 months | TX Dept of Insurance | IRO assignment via state
UT | 180 days | UT Insurance Department | Standard
VT | 4 months | VT Dept of Financial Regulation | Standard
VA | 120 days | VA Bureau of Insurance | Standard
WA | 180 days | WA Office of the Insurance Commissioner | Free external review
WV | 4 months | WV Offices of the Insurance Commissioner | Standard
WI | 4 months | WI Office of the Commissioner of Insurance | Standard
WY | 4 months | WY Dept of Insurance | Standard
DC | 4 months | DC Dept of Insurance, Securities and Banking | Standard

NOTE: Self-funded ERISA plans use the federal external review process via HHS-OPM,
NOT the state IRO, unless the state plan opted in (~half of states). For ERISA plans
in any state, advise filing federal external review through the plan's listed IRO.
`;
