import {useState} from 'react';

export const useForm = ({initialValues = {}}) => {
  const [values, setValues] = useState(initialValues);
  const [invalid, setInvalid] = useState( {});
  const setValue = (name, value) => {
    setValues({...values, [name]: value});
  };
  const onChange = event => {
    const {name, value} = event.currentTarget;
    setInvalid({...invalid, [name]: !event.currentTarget.checkValidity()});
    setValue(name, value);
  };
  const isValid = Object.values(invalid).every(value => value === false);
  return {values, setValue, isValid, invalid, setInvalid, onChange};
}
