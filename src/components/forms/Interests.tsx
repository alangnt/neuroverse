import { ObjectId } from "mongodb";
import { Dispatch, SetStateAction, FormEvent } from "react"

interface InterestsFormData {
  hobbies: string;
  goals: string;
  values: string;
}

interface Props {
  userId: ObjectId;
  formData: InterestsFormData;
  setFormData: Dispatch<SetStateAction<InterestsFormData>>;
}

export default function InterestsForm({ userId, formData, setFormData }: Props) {
  const handleChange = (field: keyof InterestsFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const fields: { name: string; value: keyof InterestsFormData; placeholder: string }[] = [
    { name: 'Hobbies & Interests', value: 'hobbies', placeholder: 'What do you enjoy doing in your free time?' },
    { name: 'Goals & Aspirations', value: 'goals', placeholder: 'What are you working towards?' },
    { name: 'Values & Beliefs', value: 'values', placeholder: 'What principles guide your decisions?' },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = { _id: userId.toString(), ...formData }

    try {
      const response = await fetch('/api/users/infos/interests', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

      const result = await response.json();

      if (response.ok) {
				window.location.reload();
			} else {
				console.error('Error updating:', result.message);
			}
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <form className="flex flex-col space-y-4 mt-4" onSubmit={handleSubmit}>
      {fields.map((field, idx) => (
        <div key={idx} className="flex flex-col">
          <label htmlFor={field.value} className="text-sm font-semibold text-gray-700 mb-1">
            {field.name}
          </label>
          <textarea
            rows={3}
            id={field.value}
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
