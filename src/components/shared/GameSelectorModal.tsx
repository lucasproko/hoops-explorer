import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { GameSelection } from "../../utils/QueryUtils";
import { ga } from "react-ga";

type Props = {
  games: GameSelection[];
  selectedGames: GameSelection[];
  show: boolean;
  onClose: () => void;
  onSubmit: (selectedGames: GameSelection[]) => void;
};

const GameSelectorModal: React.FC<Props> = ({
  games,
  selectedGames,
  show,
  onClose,
  onSubmit,
}) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const selectedGameLookup = new Set(
      selectedGames.map((g) => `${g.date}:${g.opponent}`)
    );
    const selectedIndices = _.flatMap(games, (game, index) => {
      if (selectedGameLookup.has(`${game.date}:${game.opponent}`)) {
        return [index];
      } else {
        return [];
      }
    });
    setSelectedIndexes(selectedIndices);
  }, [selectedGames, games]);

  const handleRowClick = (index: number, event: React.MouseEvent) => {
    const isShift = event.shiftKey;
    const isCtrl = event.ctrlKey || event.metaKey;

    if (isShift && lastSelectedIndex !== null) {
      const range = [lastSelectedIndex, index].sort((a, b) => a - b);
      const rangeIndexes = Array.from(
        { length: range[1] - range[0] + 1 },
        (_, i) => range[0] + i
      );
      setSelectedIndexes((prev) =>
        Array.from(new Set([...prev, ...rangeIndexes]))
      );
    } else if (isCtrl) {
      setSelectedIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedIndexes([index]);
    }
    setLastSelectedIndex(index);
  };

  const handleSubmit = () => {
    const selectedGames = selectedIndexes.map((index) => games[index]);
    onSubmit(selectedGames);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Games</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ maxHeight: "70vh", overflowY: "auto", userSelect: "none" }}
      >
        <small>
          <i>
            (Select teams using standard click/shift-click/command-click
            conventions)
          </i>
        </small>
        <Table bordered hover className="mt-2">
          <thead>
            <tr>
              <th>Date</th>
              <th>Opponent</th>
              <th>Location</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody
            style={{
              userSelect: "none", // Prevent text selection
              WebkitUserSelect: "none", // Cross-browser compatibility
              MozUserSelect: "none",
            }}
          >
            {games.map((game, index) => (
              <tr
                key={index}
                onClick={(event) => handleRowClick(index, event)}
                style={{
                  backgroundColor: selectedIndexes.includes(index)
                    ? "#d9edf7"
                    : "transparent",
                  cursor: "pointer",
                }}
              >
                <td>{game.date}</td>
                <td>{game.opponent}</td>
                <td>{game.location}</td>
                <td>{game.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button className="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GameSelectorModal;
