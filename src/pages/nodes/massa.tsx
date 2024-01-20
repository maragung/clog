// components/StatusCard.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface StatusData {
  node_id: string;
  version: string;
  current_time: number;
  current_cycle: number;
  current_cycle_time: number;
  next_cycle_time: number;
  chain_id: number;
  address: string;
  thread: number;
  final_balance: string;
  final_roll_count: number;
  candidate_balance: string;
  candidate_roll_count: number;
  created_blocks: string[];
  created_endorsements: string[];
}

const convertTimestampToDate = (timestamp: number): string => {
  // Buat objek Date dari timestamp (dalam milidetik)
  const date = new Date(timestamp);

  // Konversi ke waktu lokal komputer
  const localDate = date.toLocaleString();

  return localDate;
};

function truncateStr(value: string | undefined): string {
  if (!value) {
    return ""; // Handle undefined or null values
  }

  const maxLength = 20; // Set the maximum length you want before truncating
  if (value.length > maxLength) {
    const truncatedValue =
      value.substr(0, maxLength / 2 - 2) +
      "..." +
      value.substr(value.length - 4);
    return truncatedValue;
  }

  return value;
}

const Massa: React.FC = () => {
  const address = "AU18e3XwywtZRJSFtyTAQrKg5g7pAvyVSrCJWyCsp6zqjsNWKBhy";
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [addressesData, setAddressesData] = useState<any[] | null>(null);
  const [countdown, setCountdown] = useState<number>(60);

  const fetchData = async () => {
    try {
      // Fetch node status data
      const statusResponse = await axios.post(
        "https://mainnet.massa.net/api/v2",
        {
          jsonrpc: "2.0",
          id: 1,
          method: "get_status",
          params: [[address]],
        }
      );

      if (statusResponse.data && statusResponse.data.result) {
        setStatusData(statusResponse.data.result);
      }

      // Fetch addresses data
      const addressesResponse = await axios.post(
        "https://mainnet.massa.net/api/v2",
        {
          jsonrpc: "2.0",
          id: 1,
          method: "get_addresses",
          params: [[address]],
        }
      );

      if (addressesResponse.data && addressesResponse.data.result) {
        setAddressesData(addressesResponse.data.result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh data every minute
    const intervalId = setInterval(() => {
      fetchData();
      setCountdown(60);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div className="card-container">
      <div className="card">
        <div className="header">
          <h2>
            <button
              className="home-button"
              onClick={() => window.history.back()}
            >
              Massa Node Information
            </button>
          </h2>

          <button className="reload-button" onClick={fetchData}>
            Reload
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <tbody>
              <tr>
                <td>Node ID</td>
                <td className="mobile-truncate">{statusData?.node_id}</td>
              </tr>
              <tr>
                <td>Version</td>
                <td>{statusData?.version}</td>
              </tr>
              <tr>
                <td>Current Time</td>
                <td>
                  {statusData
                    ? convertTimestampToDate(statusData.current_time)
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Current Cycle</td>
                <td>{statusData?.current_cycle}</td>
              </tr>
              <tr>
                <td>Current Cycle Time</td>
                <td>
                  {statusData
                    ? convertTimestampToDate(statusData?.current_cycle_time)
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Next Cycle Time</td>
                <td>
                  {statusData
                    ? convertTimestampToDate(statusData?.next_cycle_time)
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Chain ID</td>
                <td>{statusData?.chain_id}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td className="mobile-truncate">
                  {addressesData && addressesData.length > 0 && (
                    <Link
                      href={`https://explorer.massa.net/mainnet/address/${addressesData[0].address}`}
                    >
                      {addressesData?.[0].address}
                    </Link>
                  )}
                </td>
              </tr>
              <tr>
                <td>Thread</td>
                <td>{addressesData?.[0].thread}</td>
              </tr>
              <tr>
                <td>Final Balance</td>
                <td>{addressesData?.[0].final_balance}</td>
              </tr>
              <tr>
                <td>Final Roll Count</td>
                <td>{addressesData?.[0].final_roll_count}</td>
              </tr>
              <tr>
                <td>Candidate Balance</td>
                <td>{addressesData?.[0].candidate_balance}</td>
              </tr>
              <tr>
                <td>Candidate Roll Count</td>
                <td>{addressesData?.[0].candidate_roll_count}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="countdown-timer">
          Time remaining for next refresh:{" "}
          <span id="countdown">{countdown}</span> seconds
        </div>
      </div>

      <style jsx>{`
        .card-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          margin: 5vh;
        }

        .card {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 90%;
          height: 95%;
          overflow: hidden; /* Add this line to hide overflowing content */
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h2 {
          color: #d32f2f;
          margin-bottom: 10px;
        }

        p {
          margin: 0;
        }

        .table-container {
          overflow-y: auto;
          max-height: 90vh;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          overflow-x: auto;
        }

        .table th,
        .table td {
          border: 1px solid #ddd;
          padding: 8px 8px 8px 5px;
          text-align: left;
          white-space: nowrap;
          overflow: hidden; /* Add this line to hide overflowing content */
          text-overflow: ellipsis; /* Add this line to show ellipsis (...) */
        }

        .reload-button {
          background-color: #d32f2f;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .reload-button:hover {
          background-color: #b71c1c;
        }

        .countdown-timer {
          margin-top: 20px;
          text-align: right;
        }

        @media only screen and (max-width: 600px) {
          .table-container {
            max-height: 300px;
            padding-right: 5%;
          }

          .card {
            width: 100%;
            padding: 5vh;
          }

          .countdown-timer {
            margin-top: 10px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Massa;
