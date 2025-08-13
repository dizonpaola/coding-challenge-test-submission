import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if (postcode.length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  /** TODO: Implement the validation logic to ensure input value
   *  is all digits and non negative
   */
  const isStrictlyNumeric = (value: string) => {
    const num = parseInt(value, 10);
    return /^\d+$/.test(value) && num >= 0;
  };

  /** TODO: Refactor the code below so there is no duplication of logic for postCode/streetNumber digit checks. */
  const validateNumericField = (value: string, fieldName: string) => {
    if (!isStrictlyNumeric(value)) {
      return res.status(400).send({
        status: "error",
        errormessage: `${fieldName} must be all digits and non negative!`,
      });
    }
    return null;
  };

  // postalcode validation
  const postcodeValidation = validateNumericField(postcode as string, "Postcode");
  if (postcodeValidation) return postcodeValidation;

  //street no validation
  const streetNumberValidation = validateNumericField(streetnumber as string, "Street Number");
  if (streetNumberValidation) return streetNumberValidation;

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
