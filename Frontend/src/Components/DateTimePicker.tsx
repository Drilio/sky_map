export interface DateTimePickerProps {
    value: Date | string;
    onChange: (pythonDateTime: string) => void;
}

export default function DateTimePicker(
    {
        value,
        onChange
    }: DateTimePickerProps) {

    const inputValue = (() => {
        if (!value) return "";

        if (value instanceof Date) {
            return value.toISOString().slice(0, 16);
        }

        return value.replace(" ", "T").slice(0, 16);

    })();

    return (
        <div
            style={{
                background: "rgba(20,24,30,0.8)",
                padding: "8px 12px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 10
            }}
        >
            <span style={{color: "white", fontSize: 14}}>
                Date/Time:
            </span>

            <input
                type="datetime-local"
                value={inputValue}
                onChange={(e) => {
                    const raw = e.target.value;
                    if (!raw) return;

                    const pythonDateTime =
                        raw.replace("T", " ") + ":00";

                    onChange(pythonDateTime);
                }}
                style={{
                    padding: "6px 8px",
                    borderRadius: 4,
                    border: "1px solid #444",
                    background: "#222",
                    color: "white",
                    fontSize: 14
                }}
            />
        </div>
    );
}
