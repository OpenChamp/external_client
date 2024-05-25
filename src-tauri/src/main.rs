// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager};

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

fn get_main_window(window: &tauri::Window) -> Result<tauri::Window, Error> {
    let main_window = match window.get_window("main") {
        Some(window) => window,
        None => {
            return Err(Error::Io(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                "main window not found",
            )))
        }
    };

    Ok(main_window)
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn set_main_window_visibility(window: tauri::Window, visible: bool) -> Result<(), Error> {
    let main_window = get_main_window(&window)?;
    if visible {
        let _ = main_window.show();
    } else {
        let _ = main_window.hide();
    }

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![set_main_window_visibility])
        .invoke_handler(tauri::generate_handler![minimize_main_window])
        .invoke_handler(tauri::generate_handler![exit_app])
        .setup(|app| {
            let _main_window = app.get_window("main").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
