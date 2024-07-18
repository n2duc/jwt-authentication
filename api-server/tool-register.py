import tkinter as tk
from tkinter import scrolledtext
import requests
from faker import Faker
import threading

fake = Faker()

registration_url = 'http://localhost:8017/v1/auth/register'  # Replace with your actual API endpoint

class RegistrationApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Registration Status")

        # Set window size and center it
        window_width = 500
        window_height = 400
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        position_top = int(screen_height / 2 - window_height / 2)
        position_right = int(screen_width / 2 - window_width / 2)
        self.root.geometry(f'{window_width}x{window_height}+{position_right}+{position_top}')

        # Frame for Entry and Label
        input_frame = tk.Frame(root)
        input_frame.pack(pady=10)

        self.number_label = tk.Label(input_frame, text="Number of accounts to create:", font=("Arial", 12))
        self.number_label.grid(row=0, column=0, padx=5)

        self.number_entry = tk.Entry(input_frame, font=("Arial", 12))
        self.number_entry.grid(row=0, column=1, padx=5)

        # Frame for Start and Close buttons
        button_frame = tk.Frame(root)
        button_frame.pack(pady=10)

        self.start_button = tk.Button(button_frame, text="Start Registration", command=self.start_registration, font=("Arial", 10))
        self.start_button.grid(row=0, column=0, padx=10)

        self.close_button = tk.Button(button_frame, text="Close", command=self.root.quit, font=("Arial", 10))
        self.close_button.grid(row=0, column=1, padx=10)

        # Scrolled text for status
        self.status_text = scrolledtext.ScrolledText(root, width=60, height=15, font=("Arial", 10))
        self.status_text.pack(padx=10, pady=10)
        
    def start_registration(self):
        try:
            num_accounts = int(self.number_entry.get())
            if num_accounts > 0:
                threading.Thread(target=self.register_accounts, args=(num_accounts,)).start()
            else:
                self.update_status("Please enter a positive number.\n")
        except ValueError:
            self.update_status("Please enter a valid number.\n")
    
    def register_accounts(self, num_accounts):
        for i in range(num_accounts):
            self.register_account(i + 1, num_accounts)
    
    def register_account(self, index, total):
        username = fake.user_name()
        email = fake.email()
        data = {
            'username': username,
            'email': email,
            'password': '123abc'
        }
        try:
            response = requests.post(registration_url, json=data)
            if response.status_code == 201:  # Assuming 201 Created is the success status code
                status_message = f"{index}/{total}: Successfully registered: {username}, {email}\n"
            else:
                status_message = f"{index}/{total}: Failed to register: {username}, {email}, Status Code: {response.status_code}\n"
        except requests.exceptions.RequestException as e:
            status_message = f"{index}/{total}: Failed to register: {username}, {email}, Error: {e}\n"
        
        self.update_status(status_message)
    
    def update_status(self, message):
        self.status_text.insert(tk.END, message)
        self.status_text.see(tk.END)  # Scroll to the end

if __name__ == "__main__":
    root = tk.Tk()
    app = RegistrationApp(root)
    root.mainloop()
