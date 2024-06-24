// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod conf;

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            conf::get_config,
            conf::set_config_value
        ])
        .setup(|app| {
            let _main_window = app.get_window("main").unwrap();
            let monitor = match _main_window.current_monitor() {
                Ok(Some(monitor)) => monitor,
                Ok(None) => {
                    eprintln!("No monitor detected");
                    return Ok(());
                }
                Err(e) => {
                    eprintln!("Failed to get current monitor: {}", e);
                    return Ok(());
                }
            };
            let monitor_size = monitor.size();

            let (width, height) = if monitor_size.width <= 1280 && monitor_size.height <= 720 {
                (1024, 576)
            } else {
                (1280, 720)
            };

            // ensure app_data_dir exists
            let c = app.config().clone();
            let app_data_dir =
                tauri::api::path::app_data_dir(&c).expect("failed to get app data dir");
            if !app_data_dir.exists() {
                std::fs::create_dir_all(app_data_dir).expect("failed to create app data dir");
            }

            _main_window
                .set_size(tauri::Size::Logical(tauri::LogicalSize {
                    width: width as f64,
                    height: height as f64,
                }))
                .expect("Failed to set window size");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
