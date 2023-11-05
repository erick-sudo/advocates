import { useState } from "react";
import { ModalLink } from "./ModalLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { InputGroup, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { OptionSelection } from "./OptionSelection";
import { utilityFunctions } from "../../assets/functions";

export function FormModal({
  inputFields = [],
  icon = <FontAwesomeIcon icon={faAdd} />,
  anchorText = "New",
  anchorClassName = "flex gap-2 items-center box_shadow rounded px-4 py-2 text-amber-800 hover:text-black hover:bg-amber-700 hover:-translate-y-2 duration-200",
  description = "New",
  onSubmit = () => {},
}) {
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <ModalLink
        anchorClassName={anchorClassName}
        anchorText={anchorText}
        submitText="Create"
        onInit={() => {}}
        hostResourceCleaner={() => {
          setFormData({});
        }}
        submitData={handleSubmit}
        disabled={Boolean(
          inputFields
            .filter((f) => f.required)
            .find((field) => !Boolean(formData[field.name]))
        )}
        description={description}
        icon={icon}
        modalContent={
          <div className="grid gap-4">
            {inputFields.map((field, index) =>
              field.as === "select" ? (
                <OptionSelection
                  key={index}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  label={field.label}
                  name={field.name}
                  options={field.options}
                />
              ) : field.as === "textarea" ? (
                <ListGroup key={index}>
                  <ListGroupItem>
                    <span className="font-bold px-4">
                      {utilityFunctions.snakeCaseToTitleCase(field.name)}
                    </span>
                  </ListGroupItem>
                  <ListGroupItem style={{ overflow: "hidden" }} className="p-0">
                    <Form.Control
                      style={{ borderRadius: 0, border: "none" }}
                      as="textarea"
                      rows={4}
                      name={field.name}
                      onChange={handleChange}
                      value={formData[field.name] || ""}
                      required
                    />
                  </ListGroupItem>
                </ListGroup>
              ) : (
                <InputGroup className="" key={index}>
                  <InputGroup.Text
                    style={{
                      maxWidth: "40%",
                      minWidth: "40%"
                    }}
                  >
                    <div className="font-bold w-full flex gap-2 flex-wrap justify-end">
                      {utilityFunctions
                        .snakeCaseToTitleCase(field.name)
                        .split(" ")
                        .map((p, i) => (
                          <span className="" key={i}>
                            {p}
                          </span>
                        ))}
                    </div>
                  </InputGroup.Text>

                  <Form.Control
                    type={field.as}
                    style={{ maxWidth: "60%", minWidth: "60%" }}
                    name={field.name}
                    onChange={handleChange}
                    value={formData[field.name] || ""}
                    required
                  />
                </InputGroup>
              )
            )}
          </div>
        }
      />
    </div>
  );
}
