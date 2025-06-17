import pytest
from app.services.log_parser import LogParser
import os

def test_log_parser_initialization():
    """Test LogParser initialization."""
    parser = LogParser("test.bin")
    assert parser.file_path == "test.bin"
    assert parser.mlog is None
    assert parser.data == {}
    assert parser.events == []
    assert parser.summary == {}

def test_parse_invalid_file():
    """Test parsing an invalid file."""
    parser = LogParser("nonexistent.bin")
    with pytest.raises(Exception):
        parser.parse()

def test_calculate_flight_time():
    """Test flight time calculation."""
    parser = LogParser("test.bin")
    parser.data = {
        'MODE': [
            {'time_usec': 1000000},
            {'time_usec': 2000000}
        ]
    }
    flight_time = parser._calculate_flight_time()
    assert flight_time == 1.0  # (2000000 - 1000000) / 1e6

def test_get_max_altitude():
    """Test maximum altitude calculation."""
    parser = LogParser("test.bin")
    parser.data = {
        'GPS': [
            {'Alt': 100},
            {'Alt': 200},
            {'Alt': 150}
        ]
    }
    max_alt = parser._get_max_altitude()
    assert max_alt == 200

def test_get_min_battery():
    """Test minimum battery voltage calculation."""
    parser = LogParser("test.bin")
    parser.data = {
        'BAT': [
            {'Volt': 12.0},
            {'Volt': 11.5},
            {'Volt': 11.8}
        ]
    }
    min_volt = parser._get_min_battery()
    assert min_volt == 11.5

def test_detect_gps_issues():
    """Test GPS issues detection."""
    parser = LogParser("test.bin")
    parser.data = {
        'GPS': [
            {'Status': 3, 'time_usec': 1000000, 'NSats': 8},
            {'Status': 2, 'time_usec': 2000000, 'NSats': 5},
            {'Status': 3, 'time_usec': 3000000, 'NSats': 7}
        ]
    }
    issues = parser._detect_gps_issues()
    assert len(issues) == 1
    assert issues[0]['status'] == 2
    assert issues[0]['satellites'] == 5

def test_get_critical_errors():
    """Test critical errors detection."""
    parser = LogParser("test.bin")
    parser.events = [
        {'type': 'ERR', 'data': {'Severity': 2}},
        {'type': 'ERR', 'data': {'Severity': 1}},
        {'type': 'MODE', 'data': {}}
    ]
    errors = parser._get_critical_errors()
    assert len(errors) == 1
    assert errors[0]['type'] == 'ERR'
    assert errors[0]['data']['Severity'] == 2 