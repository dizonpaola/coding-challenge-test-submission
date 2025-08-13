import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/useFormFields";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import transformAddress from "./core/models/address";

function App() {
   const { fields, onChange, clearFields } = useFormFields({
    postCode: '',
    houseNumber: '',
    firstName: '',
    lastName: '',
    selectedAddress: ''
  });

  const { postCode, houseNumber, firstName, lastName, selectedAddress } = fields;
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const event = {
      target: {
        name: 'selectedAddress',
        value: e.target.value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };
   
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    setAddresses([]);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
      const response = await fetch(
        `${baseUrl}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );
      
      const data = await response.json();
      
      if (response.ok && data.status === 'ok') {
        const transformedAddresses = data.details.map((address: any) =>
          transformAddress({ ...address, houseNumber })
        );
        setAddresses(transformedAddresses);
      } else {
        setError(data.errormessage || 'Failed to fetch addresses');
      }
    } catch (err) {
      setError('Network error occurred while fetching addresses');
    } finally {
      setLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
  };

   const handleClearAllFields = () => {
    clearFields();
    setAddresses([]);
    setError(undefined);
  };  

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: postCode,
                onChange: onChange
              }
            },
            {
              name: "houseNumber", 
              placeholder: "House number",
              extraProps: {
                value: houseNumber,
                onChange: onChange
              }
            }
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />
         
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: firstName,
                  onChange: onChange
                }
              },
              {
                name: "lastName",
                placeholder: "Last name", 
                extraProps: {
                  value: lastName,
                  onChange: onChange
                }
              }
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}

        <Button variant="secondary" onClick={handleClearAllFields}>
          Clear
        </Button>
         
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
