import { useState  } from "react";

export const useForm = (initialState) => {
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e) =>  {
        const { name, value , type, checked } = e.target;

        //определяем значение в зависимости от типа поля
        let finalValue;

        switch (type) {
            case 'checkbox':
                finalValue = checked;
                break;
            case 'number':
                finalValue = value === '' ? '' : parseFloat(value);
                break;
            case 'email':
            case 'text':
            case 'textarea':
            case 'password':
                finalValue = value;
                break;
            default:
                finalValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue,
        }));

        //Сбрачывавем ошибку для данного поля
        if (error[name]) {
            setError(prev => ({
                ...prev,
                [name]: '',
            }) );
        }

        //Помечаем поле как затронутое
        setTouched(prev => ({
            ...prev,
            [name]: true,
        }));
    };

    const handleBlur =(e) => {
        const {name} = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true,
        }));
    };

    const handleSelectChange = ( name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSliderChange = (name) => (e, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData(initialState);
        setError ({});
        setTouched ({});
    };

    const setFieldValue = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return {
        formData,
        error, 
        touched,
        handleChange,
        handleBlur,
        handleSelectChange,
        handleSliderChange,
        resetForm,
        setFieldValue,
        setFormData,
        setError,
    };
};