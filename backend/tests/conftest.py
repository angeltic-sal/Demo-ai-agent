import pytest
from fastapi.testclient import TestClient
from app.main import app
import os
import shutil

@pytest.fixture
def client():
    """Create a test client for the FastAPI application."""
    return TestClient(app)

@pytest.fixture
def test_upload_dir():
    """Create a temporary upload directory for testing."""
    test_dir = "test_uploads"
    os.makedirs(test_dir, exist_ok=True)
    yield test_dir
    # Cleanup after tests
    shutil.rmtree(test_dir)

@pytest.fixture
def sample_bin_file():
    """Create a sample .bin file for testing."""
    test_dir = "test_uploads"
    os.makedirs(test_dir, exist_ok=True)
    test_file = os.path.join(test_dir, "test.bin")
    with open(test_file, "wb") as f:
        f.write(b"\x00" * 100)
    return test_file 