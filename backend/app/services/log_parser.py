import os
from typing import Dict, List, Optional
import pandas as pd
from pymavlink import mavutil
from datetime import datetime
import numpy as np

class LogParser:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.mlog = None
        self.data = {}
        self.events = []
        self.summary = {}
        
    def parse(self) -> Dict:
        """Parse the MAVLink log file and extract relevant data."""
        try:
            self.mlog = mavutil.mavlink_connection(self.file_path)
            if not self.mlog:
                raise Exception("Failed to create MAVLink connection")
                
            self._extract_messages()
            self._generate_summary()
            return self.summary
        except Exception as e:
            raise Exception(f"Error parsing log file: {str(e)}")
        
    def _extract_messages(self):
        """Extract messages from the log file."""
        try:
            while True:
                msg = self.mlog.recv_match()
                if msg is None:
                    break
                    
                msg_type = msg.get_type()
                if msg_type not in self.data:
                    self.data[msg_type] = []
                    
                # Convert message to dictionary
                msg_dict = msg.to_dict()
                self.data[msg_type].append(msg_dict)
                
                # Track events
                if msg_type in ['EV', 'ERR', 'MODE']:
                    self.events.append({
                        'type': msg_type,
                        'time': msg_dict.get('time_usec', 0),
                        'data': msg_dict
                    })
        except Exception as e:
            print(f"Warning: Error extracting messages: {str(e)}")
            # Continue with whatever data we have
            
    def _generate_summary(self):
        """Generate a summary of the flight data."""
        try:
            self.summary = {
                'flight_time': self._calculate_flight_time(),
                'max_altitude': self._get_max_altitude(),
                'min_battery': self._get_min_battery(),
                'gps_issues': self._detect_gps_issues(),
                'critical_errors': self._get_critical_errors(),
                'mode_changes': self._get_mode_changes(),
                'message_types': list(self.data.keys())  # Add available message types
            }
        except Exception as e:
            print(f"Warning: Error generating summary: {str(e)}")
            self.summary = {
                'error': str(e),
                'message_types': list(self.data.keys())
            }
    
    def _calculate_flight_time(self) -> float:
        """Calculate total flight time in seconds."""
        try:
            if 'MODE' in self.data:
                times = [msg.get('time_usec', 0) for msg in self.data['MODE']]
                if times:
                    return (max(times) - min(times)) / 1e6
            return 0.0
        except Exception as e:
            print(f"Warning: Error calculating flight time: {str(e)}")
            return 0.0
    
    def _get_max_altitude(self) -> float:
        """Get maximum altitude reached during flight."""
        try:
            if 'GPS' in self.data:
                altitudes = [msg.get('Alt', 0) for msg in self.data['GPS']]
                return max(altitudes) if altitudes else 0.0
            return 0.0
        except Exception as e:
            print(f"Warning: Error getting max altitude: {str(e)}")
            return 0.0
    
    def _get_min_battery(self) -> float:
        """Get minimum battery voltage during flight."""
        try:
            if 'BAT' in self.data:
                voltages = [msg.get('Volt', 0) for msg in self.data['BAT']]
                return min(voltages) if voltages else 0.0
            return 0.0
        except Exception as e:
            print(f"Warning: Error getting min battery: {str(e)}")
            return 0.0
    
    def _detect_gps_issues(self) -> List[Dict]:
        """Detect GPS signal issues during flight."""
        try:
            gps_issues = []
            if 'GPS' in self.data:
                for msg in self.data['GPS']:
                    if msg.get('Status', 0) < 3:  # Less than 3D fix
                        gps_issues.append({
                            'time': msg.get('time_usec', 0),
                            'status': msg.get('Status', 0),
                            'satellites': msg.get('NSats', 0)
                        })
            return gps_issues
        except Exception as e:
            print(f"Warning: Error detecting GPS issues: {str(e)}")
            return []
    
    def _get_critical_errors(self) -> List[Dict]:
        """Get list of critical errors during flight."""
        try:
            return [
                event for event in self.events 
                if event['type'] == 'ERR' and event['data'].get('Severity', 0) >= 2
            ]
        except Exception as e:
            print(f"Warning: Error getting critical errors: {str(e)}")
            return []
    
    def _get_mode_changes(self) -> List[Dict]:
        """Get list of flight mode changes."""
        try:
            return [
                event for event in self.events 
                if event['type'] == 'MODE'
            ]
        except Exception as e:
            print(f"Warning: Error getting mode changes: {str(e)}")
            return []
    
    def get_dataframe(self, message_type: str) -> Optional[pd.DataFrame]:
        """Get a pandas DataFrame for a specific message type."""
        try:
            if message_type in self.data:
                return pd.DataFrame(self.data[message_type])
            return None
        except Exception as e:
            print(f"Warning: Error getting dataframe: {str(e)}")
            return None 