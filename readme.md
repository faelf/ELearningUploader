# E-Learning Uploader

## 🧾 What it does

Uploading e-learning certifications requires a CSV file in a specific format. To simplify this process, I developed this application, which allows you to search for users and trainings, set a completion date, and download a CSV file ready to upload to the e-learning platform.

## 🚀 Usage

1. Search for and select a **user** and a **training**, enter the completion date, then add the certification to the preview table.

   > ⚠️ **Note:** The form does not reset automatically. If you want to clear it, click the **Reset** button.

2. Repeat this process for as many certifications as required.
3. When you are ready, click **Download CSV** to export the file.
4. Upload the generated CSV directly to the e-learning platform.

## 👥 Managing Users and Trainings

You can add users and trainings individually using the forms within the application, or import them in bulk using CSV files. Follow the formats below.

### 👤 Users CSV Example

| ID Number | First name | Last name | Username           |
| --------- | ---------- | --------- | ------------------ |
| C0001     | Rafael     | Ferreira  | rafael@example.com |

### 🎓 Trainings CSV Example

| Certification name | ID number |
| ------------------ | --------- |
| Training One       | T0001     |

> ⚠️ Bulk uploads **replace** the existing list entirely. To update your data, upload a new CSV file rather than appending to the existing dataset.
