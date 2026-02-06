import sys
import pandas as pd
import matplotlib.pyplot as plt
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QFileDialog, QLabel
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas

class EquipmentApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Desktop Visualizer")
        self.setGeometry(100, 100, 800, 600)
        
        layout = QVBoxLayout()
        self.label = QLabel("Upload a CSV to see analysis")
        layout.addWidget(self.label)
        
        self.btn = QPushButton("Upload CSV")
        self.btn.clicked.connect(self.load_csv)
        layout.addWidget(self.btn)
        
        self.canvas_layout = QVBoxLayout()
        layout.addLayout(self.canvas_layout)
        self.setLayout(layout)

    def load_csv(self):
        path, _ = QFileDialog.getOpenFileName(self, "Open CSV", "", "CSV Files (*.csv)")
        if path:
            df = pd.read_csv(path)
            # Calculations matching your web app logic
            avg_p = df.get('Pressure', pd.Series([0])).mean()
            avg_f = df.get('Flowrate', pd.Series([0])).mean()
            self.label.setText(f"Avg Pressure: {avg_p:.2f} | Avg Flowrate: {avg_f:.2f}")
            
            # Clear old chart
            for i in reversed(range(self.canvas_layout.count())): 
                self.canvas_layout.itemAt(i).widget().setParent(None)
            
            # Create new teal chart
            fig, ax = plt.subplots()
            type_col = 'Equipment_Type' if 'Equipment_Type' in df.columns else df.columns[0]
            df[type_col].value_counts().plot(kind='bar', color='teal', ax=ax)
            ax.set_title("Equipment Distribution")
            
            canvas = FigureCanvas(fig)
            self.canvas_layout.addWidget(canvas)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = EquipmentApp()
    window.show()
    sys.exit(app.exec_())