

const BASE_URL = process.env.BACKEND_BASE_URL;

export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BASE_URL}/process-document`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('Error sending file to the backend');
        }
    } catch (error) {
        throw new Error(`Error sending file to the backend: ${error.message}`);
    }
};

export const sendMessage = async (message) => {
    try {
        const response = await fetch(`${BASE_URL}/process-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userMessage: message }),
        });

        if (response.ok) {
            const result = await response.json();
            return result["botResponse"];
        } else {
            throw new Error('Error sending file to the backend');
        }
    } catch (error) {
        throw new Error(`Error sending messsage to the backend: ${error.message}`);
    }
};
