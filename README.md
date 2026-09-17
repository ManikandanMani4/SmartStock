# SmartStock

SmartStock is an intelligent inventory management system designed to help businesses manage products, sales, stock, purchases, and reports efficiently. It uses machine learning-based demand forecasting to predict product demand, identify stock risks, and provide reorder recommendations.

## Features

- 📦 Product Management
- 🛒 Sales Management
- 📊 Inventory Management
- 🚚 Purchase Management
- 📈 Reports and Analytics
- 🔮 Demand Forecasting
- ⚠️ Stock Risk Detection
- 📋 Reorder Recommendations

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Python
- Flask
- Flask-CORS

### Machine Learning
- Pandas
- NumPy
- Scikit-learn
- Random Forest
- Joblib

### Storage
- Local Storage

## Machine Learning

SmartStock uses a **Random Forest Regression** model for demand forecasting.

The model uses historical sales data and features such as:

- Product
- Selling Price
- Current Stock
- Day
- Week
- Month
- Holiday
- Previous Sales
- 7-Day Sales History
- Supplier Lead Time

The prediction is used to identify stock risk and provide reorder recommendations.

## Project Structure

```text
SmartStock/
│
├── backend/
│   └── app.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── ml/
│   ├── train_model.py
│   └── smartstock_model.pkl
│
├── dataset/
│   └── sales_data.csv
│
└── README.md
```

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/ManikandanMani4/SmartStock.git
cd SmartStock
```

### 2. Start the Backend

```bash
cd backend
python app.py
```

The backend will run at:

```text
http://127.0.0.1:5000
```

### 3. Start the Frontend

Open another terminal:

```bash
cd SmartStock
npm install
npm run dev
```

If the frontend is inside the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Model Performance

The current Random Forest model evaluation:

| Metric | Score |
|---|---:|
| MAE | 2.85 |
| RMSE | 4.02 |
| R² Score | 0.8965 |

## Future Enhancements

- Database integration
- Real-time inventory synchronization
- Supplier management
- Automated purchase orders
- Improved demand forecasting
- Sales trend visualization
- Multi-user authentication
- Cloud deployment
- Mobile application

## License

This project is developed for educational and project-development purposes.
