# PUF - Python Universal Framework for Model Version Control

A comprehensive tool for managing machine learning models, offering version control, performance tracking, and easy deployment capabilities. It supports various ML frameworks including TensorFlow, PyTorch, and scikit-learn.

## Features

- Git-like CLI for model version control
- GitHub-style web interface with analytics
- Upload and version control ML models
- Track model versions with timestamps
- List all available model versions
- Detailed model analytics and performance tracking
- Star/unstar models
- GitHub integration
- Branching and tagging support for model versions
- Remote repository support
- Performance metrics tracking
- Version comparison
- Model statistics and metrics visualization

## PUF Commands

```bash
# Repository Management
puf init                      # Initialize a new PUF repository
puf status                    # Show repository status and changes
puf config                    # View or modify repository configuration

# Model Management
puf add model.h5              # Add a new model to the repository
puf rm model.h5              # Remove a model from the repository
puf list                     # List all models in the repository
puf info model_name          # Show detailed information about a model
puf compare model1 model2    # Compare two model versions

# Version Control
puf commit -m "message"      # Create a new commit with message
puf log                      # Show commit history
puf branch                   # List all branches
puf branch new_branch        # Create a new branch
puf checkout branch_name     # Switch to a different branch
puf merge branch_name        # Merge a branch into current branch
puf tag -a v1.0 "message"   # Create an annotated tag
puf tag                      # List all tags

# Remote Operations
puf remote add origin url    # Add a remote repository
puf remote -v               # View remote repositories
puf push                    # Push changes to remote
puf pull                    # Pull changes from remote
puf fetch                   # Fetch changes from remote without merging

# Model Statistics and Analytics
puf stats model_name         # Show model statistics
puf metrics model_name       # Show performance metrics
puf history model_name       # Show model version history
puf diff model1 model2       # Show differences between model versions

# Advanced Commands
puf gc                       # Garbage collect unused objects
puf fsck                    # Check repository integrity
puf prune                   # Remove unreachable objects
puf verify                  # Verify model integrity
```

## Command Usage Examples

```bash
# Basic workflow
puf init
puf add model.h5
puf commit -m "Initial model version"
puf branch feature-branch
puf tag v1.0
puf push

# Working with versions
puf checkout v1.0           # Switch to version v1.0
puf compare v1.0 v1.1       # Compare two versions
puf history model_name      # View version history

# Remote operations
puf remote add origin https://example.com/repo
puf push origin main        # Push to specific branch
puf pull origin main        # Pull from specific branch
```

## Supported Model Formats

PUF supports various machine learning model formats:
- TensorFlow/Keras models (.h5)
- PyTorch models (.pt, .pth)
- scikit-learn models (.pkl)
- TensorFlow SavedModel format (.pb)

Each model format has its specific use cases:
- .h5: Common format for TensorFlow/Keras models
- .pt/.pth: Standard format for PyTorch models
- .pkl: Pickle format for scikit-learn models
- .pb: TensorFlow's protocol buffer format for SavedModel

## Version Control

PUF provides robust version control capabilities:
- Track model changes and versions
- Compare different versions
- Maintain model history
- Support for branching and merging
- Tag important versions

## Web Interface

The web interface provides a modern, GitHub-like experience:
- Upload new models through the web form
- View all model versions in a table format
- Dark/light mode support
- Detailed model analytics
- Version comparison

## API Endpoints

- `POST /models/upload`: Upload a new model version
  - Parameters:
    - `model_file`: The model file to upload
    - `version` (optional): Custom version string
    - `description` (optional): Version description

- `GET /models/versions`: List all model versions

- `GET /models/{version}`: Get information about a specific version

## Restriction Notice

This application is not intended for reuse or redistribution. The codebase is provided for reference and contribution purposes only. Users are encouraged to contribute to the PUF package development and improvements rather than using this application directly.

## Contributing

We welcome contributions to enhance the PUF package. Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear documentation of changes
4. Focus on improving PUF package functionality and features

## Project Structure

```
puf/
├── src/              # Source code
│   ├── puf/         # Core package
│   │   ├── __init__.py
│   │   ├── cli.py
│   │   └── core.py
│   └── frontend/    # Web interface
│       ├── static/
│       ├── templates/
│       └── app.py
├── setup.py         # Package configuration
└── requirements.txt # Dependencies
```

## License

This project is not licensed for general use. The code is provided for reference and contribution purposes only.
