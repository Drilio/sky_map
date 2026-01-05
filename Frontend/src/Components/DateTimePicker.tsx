export interface DateTimePickerProps {
    value: Date;
    onChange: (date: Date) => void;
}

export default function DateTimePicker({value, onChange}: DateTimePickerProps) {
    return (
        <div style={{
            background: "rgba(20,24,30,0.8)",
            padding: "8px 12px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 10
        }}>
            <span style={{color: "white", fontSize: 14}}>Date/Time:</span>
            <input
                type="datetime-local"
                value={value.toISOString().slice(0, 16)}
                onChange={(e) => onChange(new Date(e.target.value))}
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
