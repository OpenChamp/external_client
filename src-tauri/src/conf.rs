use tauri::Manager;

use crate::Error;

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Config {
    pub api_base_url: String,
    pub game_exec_path: String,
}

// get exec name based on os
fn get_exec_name() -> String {
    if cfg!(target_os = "windows") {
        "OpenChamp.exe".to_string()
    } else if cfg!(target_os = "macos") {
        "OpenChamp.app".to_string()
    } else {
        // check if arm or x86
        if cfg!(target_arch = "aarch64") {
            "OpenChamp.arm64".to_string()
        } else {
            "OpenChamp.x86_64".to_string()
        }
    }
}

impl Config {
    pub fn new(c: &tauri::Config) -> Config {
        let exec_path = tauri::api::path::app_data_dir(c)
            .expect("failed to get app data dir")
            .join("game")
            .join(get_exec_name());
        println!("exec_path: {:?}", exec_path);
        Config {
            api_base_url: "http://localhost:8080".to_string(),
            game_exec_path: exec_path.to_string_lossy().to_string(),
        }
    }

    fn get_config_path(c: &tauri::Config) -> std::path::PathBuf {
        tauri::api::path::app_data_dir(c)
            .expect("failed to get app data dir")
            .join("config.json")
    }

    pub fn from_file(c: &tauri::Config) -> Result<Config, std::io::Error> {
        // if file does not exist, return default config
        let config_path = Config::get_config_path(c);
        if !config_path.exists() {
            let config = Config::new(c);
            config.write_to_file(c)?;
            return Ok(config);
        }

        // else read the file and return the config
        let file = std::fs::File::open(config_path)?;
        let reader = std::io::BufReader::new(file);
        let config: Config = serde_json::from_reader(reader)?;

        Ok(config)
    }

    pub fn write_to_file(&self, c: &tauri::Config) -> Result<(), std::io::Error> {
        let config_path = Config::get_config_path(c);
        let file = std::fs::File::create(config_path)?;
        let writer = std::io::BufWriter::new(file);
        serde_json::to_writer(writer, self)?;
        Ok(())
    }
}

#[tauri::command]
pub fn get_config(window: tauri::Window) -> Result<Config, Error> {
    let config = &window.config();
    match Config::from_file(config) {
        Ok(config) => Ok(config),
        Err(e) => {
            eprintln!("failed to read config file: {}", e);
            Ok(Config::new(config))
        }
    }
}

#[tauri::command]
pub fn set_config_value(
    window: tauri::Window,
    key: String,
    value: String,
) -> Result<Config, Error> {
    let mut config = Config::from_file(&window.config()).unwrap();
    println!("set_config_value key: {}, value: {}", key, value);
    match key.as_str() {
        "api_base_url" => config.api_base_url = value,
        "game_exec_path" => config.game_exec_path = value,
        _ => return Ok(config),
    }
    println!("config: {:?}", config);
    config.write_to_file(&window.config())?;
    Ok(config)
}

// TODO: we need a function that updates old config files with new fields
