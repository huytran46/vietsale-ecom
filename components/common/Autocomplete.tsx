import React, { useEffect, useMemo, useState } from "react";
import {
  useBoolean,
  Text,
  HStack,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  List,
  ListItem,
  ListIcon,
  Flex,
  Spacer,
  Spinner,
  Center,
} from "@chakra-ui/react";
import Highlighter from "react-highlight-words";
import { BsCircle } from "react-icons/bs";

type Suggestion = {
  label: string;
  id: string;
};

type Props = {
  isLoading: boolean;
  userInput: string;
  suggestions: Suggestion[];
  selectedSuggestions: string[];
  onChange: (userInput: string) => void;
  onSelect: (selectedId: string) => void;
  placeholder: string;
  headerText: string;
};

export const Autocomplete: React.FC<Props> = ({
  isLoading,
  userInput,
  suggestions,
  selectedSuggestions,
  onChange,
  onSelect,
  headerText,
  placeholder,
}) => {
  const [placeholdIt, setPlaceholdIt] = useState<string>();
  const [activeSuggestion, setActiveSuggestion] = useState<number>();
  const [showSuggestions, { off, on }] = useBoolean();

  const filteredSuggestions = useMemo(
    () =>
      suggestions
        ?.filter((pc) => !selectedSuggestions.includes(pc.id))
        .filter((pc) =>
          pc.label.trim().toLowerCase().includes(userInput.trim().toLowerCase())
        ) ?? [],
    [suggestions, userInput, selectedSuggestions]
  );

  function resetStates() {
    setActiveSuggestion(undefined);
    off();
  }

  function onInputChange(input: string) {
    on();
    onChange(input);
  }

  function onSelectSuggestion(activeIdx?: number) {
    const chosenIdx = activeIdx ?? activeSuggestion;
    if (typeof chosenIdx !== "undefined") {
      const chosen = filteredSuggestions[chosenIdx];
      if (chosen) {
        onInputChange(chosen.label);
        onSelect(chosen.id);
      }
      setActiveSuggestion(undefined);
      setPlaceholdIt(undefined);
      onInputChange("");
      off();
    }
  }

  function onHoverSuggestion() {
    if (typeof activeSuggestion !== "undefined") {
      const chosenIdx = activeSuggestion;
      const chosen = filteredSuggestions[chosenIdx];
      if (chosen) {
        setPlaceholdIt(chosen.label);
      }
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSelectSuggestion();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!activeSuggestion) {
        return;
      }
      setActiveSuggestion((prev) => (prev ?? 1) - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (
        activeSuggestion &&
        activeSuggestion === filteredSuggestions.length - 1
      ) {
        return;
      }
      setActiveSuggestion((prev) => (prev ?? -1) + 1);
    } else if (e.key === "Backspace") {
      setPlaceholdIt(undefined);
      setActiveSuggestion(undefined);
    }
  }

  useEffect(() => {
    onHoverSuggestion();
  }, [activeSuggestion]);

  return (
    <Popover
      returnFocusOnClose={true}
      isOpen={showSuggestions}
      onClose={off}
      placement="bottom"
      closeOnBlur={false}
      autoFocus={false}
    >
      <PopoverTrigger>
        <Input
          id="cateName"
          name="cateName"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          focusBorderColor="none"
          borderLeftRadius="sm"
          colorScheme="brand"
          variant="outline"
          placeholder={placeholdIt ?? placeholder}
          value={placeholdIt ?? userInput}
          onKeyDown={onKeyDown}
          onClick={resetStates}
          onChange={(e) => {
            onInputChange(e.target.value);
          }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <HStack>
            <Text fontWeight="semibold">{headerText}</Text>
            <PopoverCloseButton top="8px" />
          </HStack>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody minH="300px" maxH="500px" overflowY="auto">
          {isLoading ? (
            <Center minH="300px" w="full" h="full">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Center>
          ) : (
            <List size="sm" w="full" spacing={3}>
              {filteredSuggestions.map((pc, idx) => (
                <ListItem
                  key={idx}
                  ref={(el) => {
                    if (activeSuggestion !== idx) return;
                    el?.scrollIntoView({
                      block: "nearest",
                      behavior: "smooth",
                    });
                  }}
                  bg={activeSuggestion === idx ? "brand.50" : ""}
                  p={1}
                  borderRadius="md"
                >
                  <Flex alignItems="center" w="full">
                    <Text fontSize="sm" isTruncated>
                      <Highlighter
                        searchWords={[userInput]}
                        autoEscape={true}
                        textToHighlight={pc.label}
                      />
                    </Text>
                    <Spacer />
                    <ListIcon
                      as={BsCircle}
                      bg={activeSuggestion === idx ? "brand.500" : ""}
                      color={activeSuggestion === idx ? "brand.900" : ""}
                      onClick={() => onSelectSuggestion(idx)}
                      borderRadius="50%"
                      cursor="pointer"
                    />
                  </Flex>
                </ListItem>
              ))}
            </List>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
