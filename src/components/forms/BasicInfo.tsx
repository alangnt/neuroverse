import { Dispatch, SetStateAction, FormEvent } from "react"

interface BasicInfoFormData {
  name: string;
  age: string;
  location: string;
  occupation: string;
}

interface Props {
  formData: BasicInfoFormData;
  setFormData: Dispatch<SetStateAction<BasicInfoFormData>>
}

export default function BasicInfoForm({ formData, setFormData }: Props) {
  const handleChange = (field: keyof BasicInfoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const fields: { name: string; value: keyof BasicInfoFormData; placeholder: string }[] = [
    { name: 'Name', value: 'name', placeholder: 'Your name' },
    { name: 'Age', value: 'age', placeholder: 'Your age' },
    { name: 'Location', value: 'location', placeholder: 'City, Country' },
    { name: 'Occupation', value: 'occupation', placeholder: 'Your job or studies' }
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log(formData);
  }

  return (
    <form className="flex flex-col space-y-4 mt-4" onSubmit={handleSubmit}>
      {fields.map((field, idx) => (
        <div key={idx} className="flex flex-col">
          <label htmlFor={field.value} className="text-sm font-semibold text-gray-700 mb-1">
            {field.name}
          </label>
          <input
            id={field.value}
            type={field.value === 'age' ? 'number' : 'text'}
            value={formData[field.value]}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.value, e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>
      ))}

      <button type="submit" className={'w-fit border rounded border-gray-200 px-3 py-2 cursor-pointer bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all duration-150'}>Save Information</button>
    </form>
  );
}
